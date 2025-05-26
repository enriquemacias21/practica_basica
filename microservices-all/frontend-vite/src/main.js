const loginForm = document.getElementById('login-form');
const loginContainer = document.getElementById('login-container');
const menuContainer = document.getElementById('menu-container');
const tabla = document.querySelector('#tabla tbody');
const thead = document.querySelector('#tabla thead tr');
const formContainer = document.getElementById('formulario');
let usuario = null;

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const usuarioInput = document.getElementById('usuario').value;
  const claveInput = document.getElementById('clave').value;

  const res = await fetch('http://localhost:3005/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario: usuarioInput, clave: claveInput })
  });

  const data = await res.json();
  if (data.success) {
    usuario = data.usuario;
    loginContainer.style.display = 'none';
    menuContainer.style.display = 'block';
    mostrarSeccion('estudiantes');
  } else {
    alert("Credenciales inválidas");
  }
});

window.mostrarSeccion = async (seccion) => {
  let url = '';
  let campos = [];

  if (seccion === 'estudiantes') {
    url = 'http://localhost:3001/estudiantes';
    campos = ['nombre', 'cedula'];
  } else if (seccion === 'docentes') {
    url = 'http://localhost:3002/docentes';
    campos = ['nombre', 'especialidad'];
  } else if (seccion === 'matriculas') {
    url = 'http://localhost:3003/matriculas';
    campos = ['estudiante_id', 'semestre'];
  } else if (seccion === 'notas') {
    url = 'http://localhost:3004/notas';
    campos = ['estudiante_id', 'materia', 'nota'];
  }

  // Construir encabezados
  thead.innerHTML = campos.map(c => `<th>${c}</th>`).join('');

  // Mostrar formulario
  formContainer.innerHTML = `
    <form id="add-form" class="mb-4 row g-3">
      ${campos.map(c => `
        <div class="col-md-6">
          <input type="text" class="form-control" name="${c}" placeholder="${c}" required>
        </div>`).join('')}
      <div class="col-12">
        <button type="submit" class="btn btn-success">Agregar</button>
      </div>
    </form>
  `;

  // Cargar registros existentes
  const res = await fetch(url);
  const data = await res.json();
  tabla.innerHTML = '';
  data.forEach(item => {
    const row = campos.map(c => `<td>${item[c]}</td>`).join('');
    tabla.innerHTML += `<tr>${row}</tr>`;
  });

  // Agregar nuevo registro
  document.getElementById('add-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const objeto = {};
    formData.forEach((val, key) => objeto[key] = val);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(objeto)
    });

    if (response.ok) {
      alert("Registro agregado correctamente.");
      mostrarSeccion(seccion);
    } else {
      alert("Error al agregar.");
    }
  });
};

window.cerrarSesion = () => {
  usuario = null;
  menuContainer.style.display = 'none';
  loginContainer.style.display = 'block';
};
