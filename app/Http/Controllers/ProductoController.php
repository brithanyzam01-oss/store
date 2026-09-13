<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Categoria;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class ProductoController extends Controller
{
    /**
     * Mostrar productos.
     */
    public function index()
    {
        $productos = Producto::with('categoria')->get();
        $categorias = Categoria::all();

        return Inertia::render('Productos/Index', [
            'productos' => $productos,
            'categorias' => $categorias,
        ]);
    }

    /**
     * Guardar producto.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
            'descripcion' => 'nullable|string',
            'precio' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'fecha_vencimiento' => 'nullable|date',
            'categoria_id' => 'required|exists:categorias,id',
        ]);

        Producto::create($validated);

        return redirect()->route('productos.index');
    }

    /**
     * Actualizar producto.
     */
    public function update(Request $request, string $id)
    {
        $producto = Producto::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
            'descripcion' => 'nullable|string',
            'precio' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'fecha_vencimiento' => 'nullable|date',
            'categoria_id' => 'required|exists:categorias,id',
        ]);

        $producto->update($validated);

        return redirect()->route('productos.index');
    }

    /**
     * Eliminar producto.
     */
    public function destroy(string $id)
    {
        $producto = Producto::findOrFail($id);

        $producto->delete();

        return redirect()->route('productos.index');
    }

    public function generarPdf()
    {
        // Traer productos cargando su relación 'categoria' (Eager Loading)
        $productos = Producto::with('categoria')->get();
        // Cálculo de métricas
        $totalProductos = $productos->count();
        $precioPromedio = $productos->avg('precio');
        // Cargar vista Blade enviando datos
        $pdf = Pdf::loadView('pdf.productos', compact('productos', 'totalProductos',
        'precioPromedio'));
        // Descargar PDF
        return $pdf->download('reporte_productos_' . date('Y-m-d') . '.pdf');
        }
}