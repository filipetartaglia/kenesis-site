-- Verificação das regras do schema contra o banco real.
--   npm run db:check
-- Roda inteiro dentro de uma transação e faz ROLLBACK: não deixa resíduo.
-- Cada bloco falha ruidosamente se a regra correspondente parar de valer.

BEGIN;

DO $$
DECLARE
  uid   uuid;
  pid   uuid;
  pid2  uuid;
  vetor tsvector;
  n     int;
BEGIN
  ---------------------------------------------------------------- correção 1
  -- Pessoa que só aparece na seção Equipe entra sem senha nenhuma.
  INSERT INTO users (email, name, role, is_public, password_hash)
  VALUES ('vitrine@kenesis.test', 'Só Vitrine', 'corretor', true, NULL)
  RETURNING id INTO uid;

  ---------------------------------------------------------------- correção 4
  -- description, neighborhood e city nulos não podem zerar o vetor de busca.
  INSERT INTO properties (slug, title, property_type, created_by, description, neighborhood)
  VALUES ('casa-teste-icarai', 'Casa com vista para a baía', 'casa', uid, NULL, NULL)
  RETURNING id, search_vector INTO pid, vetor;

  IF vetor IS NULL OR vetor = ''::tsvector THEN
    RAISE EXCEPTION 'correção 4: search_vector veio vazio com campos nulos';
  END IF;

  IF NOT (vetor @@ to_tsquery('portuguese', 'baía')) THEN
    RAISE EXCEPTION 'correção 4: search_vector não indexou o título em português';
  END IF;

  ---------------------------------------------------------------- correção 2
  INSERT INTO property_images (property_id, path, is_cover)
  VALUES (pid, 'imoveis/casa-teste-icarai/01.webp', true);

  BEGIN
    INSERT INTO property_images (property_id, path, is_cover)
    VALUES (pid, 'imoveis/casa-teste-icarai/02.webp', true);
    RAISE EXCEPTION 'correção 2: o banco aceitou uma segunda capa no mesmo imóvel';
  EXCEPTION WHEN unique_violation THEN
    NULL; -- esperado
  END;

  -- Mas outra foto não-capa no mesmo imóvel continua permitida.
  INSERT INTO property_images (property_id, path, is_cover)
  VALUES (pid, 'imoveis/casa-teste-icarai/02.webp', false);

  ---------------------------------------------------------------- correção 5
  BEGIN
    INSERT INTO leads (name, phone, email) VALUES ('Sem contato', NULL, NULL);
    RAISE EXCEPTION 'correção 5: o banco aceitou lead sem telefone e sem e-mail';
  EXCEPTION WHEN check_violation THEN
    NULL; -- esperado
  END;

  -- Só WhatsApp basta: é como a maioria dos leads chega.
  INSERT INTO leads (name, phone, property_id) VALUES ('Só WhatsApp', '21999998888', pid);

  ---------------------------------------------------------------- correção 3
  -- O histórico registra o slug antigo para o 301.
  INSERT INTO property_slug_history (property_id, slug) VALUES (pid, 'mansao-jardim-uba');

  -- ATENÇÃO: o banco NÃO impede um imóvel novo de tomar um slug que já é
  -- histórico de outro. As duas tabelas têm unique separados. Este bloco existe
  -- para provar isso — a defesa é a geração de slug consultar as duas tabelas.
  INSERT INTO properties (slug, title, property_type)
  VALUES ('mansao-jardim-uba', 'Imóvel que roubou o slug', 'apartamento')
  RETURNING id INTO pid2;

  IF pid2 IS NULL THEN
    RAISE EXCEPTION 'correção 3: premissa mudou — o banco passou a bloquear a colisão';
  END IF;

  ---------------------------------------------------------------- cascade
  DELETE FROM properties WHERE id = pid;

  SELECT count(*) INTO n FROM property_images WHERE property_id = pid;
  IF n <> 0 THEN
    RAISE EXCEPTION 'cascade: sobraram % fotos após excluir o imóvel', n;
  END IF;

  SELECT count(*) INTO n FROM property_slug_history WHERE property_id = pid;
  IF n <> 0 THEN
    RAISE EXCEPTION 'cascade: sobrou histórico de slug após excluir o imóvel';
  END IF;

  -- O lead sobrevive ao imóvel e vira contato geral (property_id nulo).
  -- Se esta FK voltar a ser NO ACTION, o DELETE acima falha e o painel não
  -- consegue excluir nenhum imóvel que já tenha recebido interesse.
  SELECT count(*) INTO n FROM leads WHERE name = 'Só WhatsApp' AND property_id IS NULL;
  IF n <> 1 THEN
    RAISE EXCEPTION 'o lead não virou contato geral após excluir o imóvel';
  END IF;

  RAISE NOTICE 'OK — as 5 regras de banco e o cascade estão valendo.';
END $$;

ROLLBACK;
