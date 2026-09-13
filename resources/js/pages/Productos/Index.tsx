import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';

interface Producto {
    id: number;
    nombre: string;
    descripcion: string | null;
    precio: number;
    stock: number;
    fecha_vencimiento: string | null;
    categoria_id: number;
}

interface Categoria {
    id: number;
    Nombre: string;
}

export default function Productos({
    productos,
    categorias,
}: {
    productos: Producto[];
    categorias: Categoria[];
}) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingProducto, setEditingProducto] =
        useState<Producto | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        fecha_vencimiento: '',
        categoria_id: '',
    });

    // =========================
    // AÑADIR PRODUCTO
    // =========================

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/productos', {
            onSuccess: () => {
                reset();
                setIsCreateOpen(false);
            },
        });
    };

    // =========================
    // ABRIR EDITAR
    // =========================

    const handleEdit = (producto: Producto) => {
        setEditingProducto(producto);

        setData({
            nombre: producto.nombre,
            descripcion: producto.descripcion || '',
            precio: producto.precio.toString(),
            stock: producto.stock.toString(),
            fecha_vencimiento:
                producto.fecha_vencimiento || '',
            categoria_id: producto.categoria_id.toString(),
        });
    };

    // =========================
    // ACTUALIZAR PRODUCTO
    // =========================

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingProducto) return;

        put(`/productos/${editingProducto.id}`, {
            onSuccess: () => {
                reset();
                setEditingProducto(null);
            },
        });
    };

    // =========================
    // ELIMINAR PRODUCTO
    // =========================

    const handleDelete = (id: number) => {
        if (
            confirm(
                '¿Estás seguro de que deseas eliminar este producto?',
            )
        ) {
            router.delete(`/productos/${id}`);
        }
    };

    return (
        <div className="p-4">
            <Head title="Productos" />

            {/* ENCABEZADO */}

            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold">
                    Lista de Productos
                </h1>

                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Añadir Producto
                </button>

                <a
                    href="/reporteproductos-pdf"
                    target="_blank"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm
font-medium flex items-center gap-2"
                >
                    Generar PDF Productos
                </a>
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
                                Producto
                            </th>

                            <th className="p-3 text-left">
                                Descripción
                            </th>

                            <th className="p-3 text-left">
                                Precio
                            </th>

                            <th className="p-3 text-left">
                                Stock
                            </th>

                            <th className="p-3 text-left">
                                Fecha de vencimiento
                            </th>

                            <th className="p-3 text-left">
                                Categoría
                            </th>

                            <th className="p-3 text-right">
                                Acciones
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {productos.map((producto) => (
                            <tr
                                key={producto.id}
                                className="border-b"
                            >
                                <td className="p-3">
                                    {producto.id}
                                </td>

                                <td className="p-3">
                                    {producto.nombre}
                                </td>

                                <td className="p-3">
                                    {producto.descripcion || '-'}
                                </td>

                                <td className="p-3">
                                    ${producto.precio}
                                </td>

                                <td className="p-3">
                                    {producto.stock}
                                </td>

                                <td className="p-3">
                                    {producto.fecha_vencimiento ||
                                        '-'}
                                </td>

                                <td className="p-3">
                                    {producto.categoria_id}
                                </td>

                                <td className="p-3">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() =>
                                                handleEdit(
                                                    producto,
                                                )
                                            }
                                            className="px-3 py-1 bg-amber-500 text-white rounded hover:bg-amber-600 text-sm"
                                        >
                                            Editar
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    producto.id,
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
                            Añadir Producto
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
                                    value={data.nombre}
                                    onChange={(e) =>
                                        setData(
                                            'nombre',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded border p-2 text-sm"
                                    required
                                />

                                {errors.nombre && (
                                    <span className="text-red-500 text-sm">
                                        {errors.nombre}
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
                            </div>

                            {/* PRECIO */}

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Precio
                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.precio}
                                    onChange={(e) =>
                                        setData(
                                            'precio',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded border p-2 text-sm"
                                    required
                                />

                                {errors.precio && (
                                    <span className="text-red-500 text-sm">
                                        {errors.precio}
                                    </span>
                                )}
                            </div>

                            {/* STOCK */}

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Stock
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    value={data.stock}
                                    onChange={(e) =>
                                        setData(
                                            'stock',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded border p-2 text-sm"
                                    required
                                />

                                {errors.stock && (
                                    <span className="text-red-500 text-sm">
                                        {errors.stock}
                                    </span>
                                )}
                            </div>

                            {/* FECHA */}

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Fecha de vencimiento
                                </label>

                                <input
                                    type="date"
                                    value={data.fecha_vencimiento}
                                    onChange={(e) =>
                                        setData(
                                            'fecha_vencimiento',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded border p-2 text-sm"
                                />

                                {errors.fecha_vencimiento && (
                                    <span className="text-red-500 text-sm">
                                        {errors.fecha_vencimiento}
                                    </span>
                                )}
                            </div>

                            {/* CATEGORÍA */}

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Categoría
                                </label>

                                <select
                                    value={data.categoria_id}
                                    onChange={(e) =>
                                        setData(
                                            'categoria_id',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded border p-2 text-sm"
                                    required
                                >
                                    <option value="">
                                        Selecciona una categoría
                                    </option>

                                    {categorias.map((categoria) => (
                                        <option
                                            key={categoria.id}
                                            value={categoria.id}
                                        >
                                            {categoria.Nombre}
                                        </option>
                                    ))}
                                </select>

                                {errors.categoria_id && (
                                    <span className="text-red-500 text-sm">
                                        {errors.categoria_id}
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

            {editingProducto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-xl dark:bg-gray-800">

                        <h2 className="text-lg font-bold mb-4">
                            Editar Producto #{editingProducto.id}
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
                                    value={data.nombre}
                                    onChange={(e) =>
                                        setData(
                                            'nombre',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded border p-2 text-sm"
                                    required
                                />
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
                            </div>

                            {/* PRECIO */}

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Precio
                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.precio}
                                    onChange={(e) =>
                                        setData(
                                            'precio',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded border p-2 text-sm"
                                    required
                                />
                            </div>

                            {/* STOCK */}

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Stock
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    value={data.stock}
                                    onChange={(e) =>
                                        setData(
                                            'stock',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded border p-2 text-sm"
                                    required
                                />
                            </div>

                            {/* FECHA */}

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Fecha de vencimiento
                                </label>

                                <input
                                    type="date"
                                    value={
                                        data.fecha_vencimiento
                                    }
                                    onChange={(e) =>
                                        setData(
                                            'fecha_vencimiento',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded border p-2 text-sm"
                                />
                            </div>

                            {/* CATEGORÍA */}

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Categoría
                                </label>

                                <select
                                    value={data.categoria_id}
                                    onChange={(e) =>
                                        setData(
                                            'categoria_id',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded border p-2 text-sm"
                                    required
                                >
                                    <option value="">
                                        Selecciona una categoría
                                    </option>

                                    {categorias.map((categoria) => (
                                        <option
                                            key={categoria.id}
                                            value={categoria.id}
                                        >
                                            {categoria.Nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* BOTONES */}

                            <div className="flex justify-end gap-2">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingProducto(null);
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