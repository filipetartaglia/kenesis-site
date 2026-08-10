"use client";

import { useActionState } from "react";
import { loginAction } from "@/server/auth/actions";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Kenesis Imobiliária</h1>
        <p className="mt-2 text-sm text-gray-500">Acesse o painel administrativo</p>
      </div>

      <form action={formAction} className="space-y-6">
        {state?.error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {state.error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Senha
          </label>
          <div className="relative mt-1">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 outline-none focus:border-kenesis-green focus:ring-1 focus:ring-kenesis-green"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="flex w-full justify-center rounded-md bg-kenesis-green px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-kenesis-green/90 focus:outline-none focus:ring-2 focus:ring-kenesis-green focus:ring-offset-2 disabled:opacity-70 transition-all"
        >
          {isPending ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            "Entrar no Painel"
          )}
        </button>
      </form>
    </div>
  );
}
