// Fuente única de verdad para las listas de opciones que se envían a la API
// Si necesitas agregar/quitar una opción, este es el ÚNICO archivo que se toca
// — tanto el formulario de captura como el resumen de solo lectura lo importan
// de aquí, así nunca se desincronizan entre sí.

export const PROFESSIONAL_TYPES = [
  { value: "dermatologo", label: "Dermatólogo" },
  { value: "ginecologo", label: "Ginecólogo" },
  { value: "endocrinologo", label: "Endocrinólogo" },
  { value: "psicologo_psiquiatra", label: "Psicólogo / Psiquiatra" },
  { value: "medico_estetico", label: "Médico Estético" },
  { value: "cirujano_plastico", label: "Cirujano Plástico" },
  { value: "cosmetologo", label: "Cosmetólogo" },
  { value: "fisioterapeuta", label: "Fisioterapeuta" },
  { value: "nutriologo", label: "Nutriólogo" },
  { value: "otro", label: "Otro" },
];

export const DIET_OPTIONS = [
  { value: "refrescos", label: "Refrescos" },
  { value: "bebidas_energizantes", label: "Bebidas energizantes" },
  { value: "cafe", label: "Café" },
  { value: "alcohol", label: "Alcohol" },
  { value: "pan_dulce_azucar", label: "Pan dulce y Azúcar" },
  { value: "frituras", label: "Frituras" },
  { value: "comida_picante", label: "Comida picante" },
  { value: "lacteos", label: "Lácteos" },
  { value: "proteina_gimnasio", label: "Proteína gimnasio" },
  { value: "carnes_rojas", label: "Carnes rojas" },
  { value: "vegetales", label: "Vegetales" },
  { value: "almendras_nueces", label: "Almendras / Nueces" },
  { value: "frutas", label: "Frutas" },
  { value: "tabaco_vape", label: "Tabaco / Vape" },
  { value: "cannabis_drogas", label: "Cannabis / Drogas" },
  { value: "litros_agua_diarios", label: "Litros de agua diarios" },
];

export const SKIN_PRACTICES = [
  { value: "hidroquinona", label: "Hidroquinona" },
  { value: "barmicil", label: "Barmicil" },
  { value: "corticoides", label: "Corticoides" },
  { value: "remedios_caseros", label: "Remedios caseros" },
  { value: "otro", label: "Otro" },
];

// Helper: busca el label legible a partir del value guardado en la BD.
// Si no lo encuentra (dato viejo/corrupto), regresa el value tal cual en
// vez de romper la pantalla — así el resumen nunca truena por un dato raro.
export const findLabel = (options, value) =>
  options.find((opt) => opt.value === value)?.label || value;
