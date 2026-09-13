import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';

interface Categoria {
    id: number;
    Nombre: string;
    descripcion: string;
}

export default function Dashboard({
    categorias,
}: {
    categorias: Categoria[];
}) {
    // Estados para los modales
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingCategoria, setEditingCategoria] =
        useState<Categoria | null>(null);

    // Formulario de Inertia
    const { data, setData, post, put, processing, errors, reset } = useForm({
        Nombre: '',
        descripcion: '',
    });

    // -----------------------------
    // AÑADIR CATEGORÍA
    // -----------------------------
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/categorias', {
            onSuccess: () => {
                reset();
                setIsCreateOpen(false);
            },
        });
    };

    // -----------------------------
    // ABRIR MODAL DE EDITAR
    // -----------------------------
    const handleEdit = (categoria: Categoria) => {
        setEditingCategoria(categoria);

        setData({
            Nombre: categoria.Nombre,
            descripcion: categoria.descripcion || '',
        });
    };

    // -----------------------------
    // ACTUALIZAR CATEGORÍA
    // -----------------------------
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingCategoria) return;

        put(`/categorias/${editingCategoria.id}`, {
            onSuccess: () => {
                reset();
                setEditingCategoria(null);
            },
        });
    };

    // -----------------------------
    // ELIMINAR CATEGORÍA
    // -----------------------------
    const handleDelete = (id: number) => {
        if (
            confirm(
                '¿Estás seguro de que deseas eliminar esta categoría?',
            )
        ) {
            router.delete(`/categorias/${id}`);
        }
    };

    return (
        <div className="p-4">
            <Head title="Categorías" />

            {/* ENCABEZADO */}
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold">
                    Lista de Categorías
                </h1>

                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Añadir
                </button>
            </div>

            {/* TABLA */}
            <div className="relative overflow-x-auto rounded-xl border border-sidebar-border/70">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="p-3 text-left">
                                ID
                            </th>

                            <th className="p-3 text-left">
                                Categoría
                            </th>

                            <th className="p-3 text-left">
                                Descripción
                            </th>

                            <th className="p-3 text-right">
                                Acciones
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {categorias.map((categoria) => (
                            <tr
                                key={categoria.id}
                                className="border-b"
                            >
                                <td className="p-3">
                                    {categoria.id}
                                </td>

                                <td className="p-3">
                                    {categoria.Nombre}
                                </td>

                                <td className="p-3">
                                    {categoria.descripcion}
                                </td>

                                <td className="p-3">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() =>
                                                handleEdit(categoria)
                                            }
                                            className="px-3 py-1 bg-amber-500 text-white rounded hover:bg-amber-600 text-sm"
                                        >
                                            Editar
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    categoria.id,
                                                )
                                            }
                                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ========================= */}
            {/* MODAL AÑADIR */}
            {/* ========================= */}

            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-xl dark:bg-gray-800">
                        <h2 className="text-lg font-bold mb-4">
                            Añadir Categoría
                        </h2>

                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4"
                        >
                            {/* NOMBRE */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Nombre
                                </label>

                                <input
                                    type="text"
                                    value={data.Nombre}
                                    onChange={(e) =>
                                        setData(
                                            'Nombre',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded border p-2 text-sm"
                                    required
                                />

                                {errors.Nombre && (
                                    <span className="text-red-500 text-sm">
                                        {errors.Nombre}
                                    </span>
                                )}
                            </div>

                            {/* DESCRIPCIÓN */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Descripción
                                </label>

                                <textarea
                                    value={data.descripcion}
                                    onChange={(e) =>
                                        setData(
                                            'descripcion',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded border p-2 text-sm"
                                    rows={3}
                                />

                                {errors.descripcion && (
                                    <span className="text-red-500 text-sm">
                                        {errors.descripcion}
                                    </span>
                                )}
                            </div>

                            {/* BOTONES */}
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreateOpen(false);
                                        reset();
                                    }}
                                    className="px-4 py-2 border rounded text-sm"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================= */}
            {/* MODAL EDITAR */}
            {/* ========================= */}

            {editingCategoria && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-xl dark:bg-gray-800">
                        <h2 className="text-lg font-bold mb-4">
                            Editar Categoría #{editingCategoria.id}
                        </h2>

                        <form
                            onSubmit={handleUpdate}
                            className="flex flex-col gap-4"
                        >
                            {/* NOMBRE */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Nombre
                                </label>

                                <input
                                    type="text"
                                    value={data.Nombre}
                                    onChange={(e) =>
                                        setData(
                                            'Nombre',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded border p-2 text-sm"
                                    required
                                />

                                {errors.Nombre && (
                                    <span className="text-red-500 text-sm">
                                        {errors.Nombre}
                                    </span>
                                )}
                            </div>

                            {/* DESCRIPCIÓN */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Descripción
                                </label>

                                <textarea
                                    value={data.descripcion}
                                    onChange={(e) =>
                                        setData(
                                            'descripcion',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded border p-2 text-sm"
                                    rows={3}
                                />

                                {errors.descripcion && (
                                    <span className="text-red-500 text-sm">
                                        {errors.descripcion}
                                    </span>
                                )}
                            </div>

                            {/* BOTONES */}
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingCategoria(null);
                                        reset();
                                    }}
                                    className="px-4 py-2 border rounded text-sm"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-amber-500 text-white rounded text-sm hover:bg-amber-600 disabled:opacity-50"
                                >
                                    Actualizar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}