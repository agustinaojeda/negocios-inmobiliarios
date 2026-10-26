import { useState, useEffect } from "react";
import {
  obtenerPropietarios,
  eliminarImagenPropiedad,
} from "../services/agenteService";

export const FORM_INMUEBLE_INICIAL = {
  titulo: "",
  direccion: "",
  zona: "",
  moneda: "USD",
  precio: "",
  expensas: "",
  categoria: "departamento",
  estado_comercial: "venta",
  estado_visibilidad: "activo",
  ambientes: 2,
  banos: 1,
  m2: 50,
  propietario_id: "",
  descripcion: "",
};

export function useModalFormularioInmueble({
  mostrar,
  propiedadEditar,
  onGuardar,
  onCerrar,
}) {
  const [formData, setFormData] = useState(FORM_INMUEBLE_INICIAL);
  const [archivosImagenes, setArchivosImagenes] = useState([]);
  const [imagenesExistentes, setImagenesExistentes] = useState([]);
  const [previewsLocales, setPreviewsLocales] = useState([]);
  const [propietarios, setPropietarios] = useState([]);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  const esEdicion = Boolean(propiedadEditar);

  //carga de propietarios
  useEffect(() => {
    if (!mostrar) return;
    let cancelado = false;

    async function cargarLista() {
      const lista = await obtenerPropietarios();
      if (!cancelado) setPropietarios(lista);
    }

    cargarLista();
    return () => {
      cancelado = true;
    };
  }, [mostrar]);

  //carga o reseteo del formulario
  useEffect(() => {
    if (propiedadEditar) {
      setFormData({
        titulo: propiedadEditar.titulo || "",
        direccion: propiedadEditar.direccion || "",
        zona: propiedadEditar.zona || "",
        moneda: propiedadEditar.moneda || "USD",
        precio: propiedadEditar.precio || "",
        expensas: propiedadEditar.expensas || "",
        categoria: propiedadEditar.categoria || "departamento",
        estado_comercial: propiedadEditar.estado_comercial || "venta",
        estado_visibilidad: propiedadEditar.estado_visibilidad || "activo",
        ambientes: propiedadEditar.ambientes || 1,
        banos: propiedadEditar.banos || 1,
        m2: propiedadEditar.m2 || 0,
        propietario_id: propiedadEditar.propietario_id || "",
        descripcion: propiedadEditar.descripcion || "",
      });

      if (propiedadEditar.imagenes && propiedadEditar.imagenes.length > 0) {
        setImagenesExistentes(propiedadEditar.imagenes);
      } else {
        setImagenesExistentes([]);
      }
    } else {
      setFormData(FORM_INMUEBLE_INICIAL);
    }
    setArchivosImagenes([]);
    setPreviewsLocales([]);
    setErrores({});
  }, [propiedadEditar, mostrar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "estado_comercial" && value === "venta"
        ? { expensas: "" }
        : {}),
    }));

    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ACUMULA FOTOS NUEVAS SIN REEMPLAZAR
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const totalProyectado =
      imagenesExistentes.length + archivosImagenes.length + files.length; //img que ya estan + img que subio + img que acaba de subir

    if (totalProyectado > 10) {
      const permitidas =
        10 - (imagenesExistentes.length + archivosImagenes.length);
      setErrores((prev) => ({
        ...prev,
        imagenes: `Límite superado. Podés agregar como máximo ${permitidas} foto(s) más.`,
      }));
      return;
    }

    //limpiar errores
    setErrores((prev) => ({ ...prev, imagenes: "" }));

    setArchivosImagenes((prev) => [...prev, ...files]);
    setPreviewsLocales((prev) => [
      ...prev,
      ...files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    ]);
  };

  const handleRemoveImage = async (item, esExistente) => {
    if (esExistente) {
      if (!window.confirm("¿Eliminar esta imagen de forma permanente?")) return;
      try {
        await eliminarImagenPropiedad(item.id);
        setImagenesExistentes((prev) =>
          prev.filter((img) => img.id !== item.id),
        );
      } catch (err) {
        alert(err.message || "No se pudo eliminar la imagen");
      }
    } else {
      setArchivosImagenes((prev) => prev.filter((f) => f !== item.file));
      setPreviewsLocales((prev) => prev.filter((p) => p.url !== item.url));
    }
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!formData.titulo.trim())
      nuevosErrores.titulo = "El título es obligatorio";
    if (!formData.direccion.trim())
      nuevosErrores.direccion = "La dirección es obligatoria";
    if (!formData.zona.trim())
      nuevosErrores.zona = "La zona/barrio es obligatoria";

    if (!formData.precio || Number(formData.precio) <= 0) {
      nuevosErrores.precio = "Ingresá un precio válido";
    }
    if (!formData.m2 || Number(formData.m2) <= 0) {
      nuevosErrores.m2 = "Ingresá los m² totales";
    }

    const totalFotos = imagenesExistentes.length + archivosImagenes.length;

    if (totalFotos === 0) {
      nuevosErrores.imagenes = "Tenés que subir al menos una foto del inmueble";
    } else if (totalFotos > 10) {
      nuevosErrores.imagenes =
        "El inmueble no puede tener más de 10 imágenes en total";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    setGuardando(true);
    try {
      const bodyFormData = new FormData();

      if (esEdicion && propiedadEditar?.id) {
        bodyFormData.append("id", propiedadEditar.id);
      }

      bodyFormData.append("titulo", formData.titulo);
      bodyFormData.append("direccion", formData.direccion);
      bodyFormData.append("zona", formData.zona);
      bodyFormData.append("categoria", formData.categoria);
      bodyFormData.append("estado_comercial", formData.estado_comercial);
      bodyFormData.append("estado_visibilidad", formData.estado_visibilidad);
      bodyFormData.append("moneda", formData.moneda);
      bodyFormData.append("precio", formData.precio);
      bodyFormData.append("expensas", formData.expensas || 0);
      bodyFormData.append("ambientes", formData.ambientes);
      bodyFormData.append("banos", formData.banos);
      bodyFormData.append("m2", formData.m2);
      bodyFormData.append("descripcion", formData.descripcion);

      if (formData.propietario_id) {
        bodyFormData.append("propietario_id", formData.propietario_id);
      }

      archivosImagenes.forEach((archivo) => {
        bodyFormData.append("imagenes", archivo);
      });

      await onGuardar(bodyFormData);
      onCerrar();
    } catch (err) {
      console.error("Error al guardar propiedad:", err);
      setErrores({ global: err.message || "Ocurrió un error al guardar" });
    } finally {
      setGuardando(false);
    }
  };

  return {
    formData,
    propietarios,
    errores,
    guardando,
    esEdicion,
    handleChange,
    handleFileChange,
    handleSubmit,
    imagenesExistentes,
    previewsLocales,
    handleRemoveImage,
  };
}
