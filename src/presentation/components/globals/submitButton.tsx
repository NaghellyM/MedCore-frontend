interface SubmitButtonProps {
    loading: boolean
}

export function SubmitButton({ loading }: SubmitButtonProps) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
            {loading ? "Registrando..." : "Registrar"}
        </button>
    )
}
