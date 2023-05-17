// // JavaScript
// document.addEventListener("DOMContentLoaded", function () {
//   llenarTabla();
// });

// async function llenarTabla(){
//   // Hacer petición GET a la API
//     const response = await fetch("http://localhost:3000/api/v1/consumos/3");
//     const jsonres = await response.json();
//     const data = jsonres.data;

//     try {
//       const values = data.reduce((acc, val) => {
//         return [...acc, Object.values(val)];
//       }, []);
//         console.log(values);
//         return values;
//     } catch (e) {
//       console.log("Invalid JSON");
//     }
// };