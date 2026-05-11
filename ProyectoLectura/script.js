
const niveles = [
    { desordenada: "L - E - R - E", correcta: "leer" },
    { desordenada: "R - I - B - L - O", correcta: "libro" },
    { desordenada: "X - O - T - E - T", correcta: "texto" },
    { desordenada: "N - D - O - M - U", correcta: "mundo" },
    { desordenada: "R - E - S - B - A", correcta: "saber" },
    { desordenada: "D - I - E - A", correcta: "idea" },
    { desordenada: "J - E - A - V - I", correcta: "viaje" },
    { desordenada: "N - A - L - A - P", correcta: "plana" },
    { desordenada: "J - A - H - O", correcta: "hoja" },
    { desordenada: "S - O - M - I - N - I", correcta: "mision" }
];

let nivelActual = 0;

function procesarRespuesta() {
    const input = document.getElementById('respuesta-usuario');
    const fb = document.getElementById('feedback');
    const letras = document.getElementById('letras-desordenadas');
    const indicador = document.getElementById('indicador-level');
    const respuestaSucia = input.value.toLowerCase().trim();

    if (respuestaSucia === niveles[nivelActual].correcta) {
        fb.innerText = "¡GENIAL! ✨";
        fb.style.color = "white";
        fb.className = "candy-crush-efecto";
        nivelActual++; 

        setTimeout(() => {
            if (nivelActual < niveles.length) {
                letras.innerText = niveles[nivelActual].desordenada;
                indicador.innerText = `Misión: ${nivelActual + 1} / 10`;
                input.value = ""; fb.innerText = ""; fb.className = "";
                input.focus();
            } else {
                letras.innerText = "¡ERES UNA ESTRELLA! 🏆";
                input.style.display = "none";
                document.querySelector('.btn-neon').style.display = "none";
                fb.innerText = "Misiones completadas";
            }
        }, 1500);
    } else {
        fb.innerText = "¡Intenta otra vez! 👾";
        fb.style.color = "#ff00ff";
    }
}


const misionesOraciones = [
    { desordenada: ["k-pop", "escucho", "Yo"], correcta: "Yo escucho k-pop" },
    { desordenada: ["libro", "El", "es", "azul"], correcta: "El libro es azul" },
    { desordenada: ["corre", "parque", "en", "perro", "El", "el"], correcta: "El perro corre en el parque" },
    { desordenada: ["gato", "El", "cama", "duerme", "en", "la"], correcta: "El gato duerme en la cama" },
    { desordenada: ["frutas", "comemos", "Nosotros", "saludables"], correcta: "Nosotros comemos frutas saludables" },
    { desordenada: ["Me", "comer", "helado", "de", "chocolate", "gusta"], correcta: "Me gusta comer helado de chocolate" },
    { desordenada: ["historia", "cuenta", "abuela", "una", "La"], correcta: "La abuela cuenta una historia" }
];

let misionActual = 0;

function cargarOracion() {
    const caja = document.getElementById('caja-palabras');
    const zonaR = document.getElementById('zona-respuesta');
    if(!caja || !zonaR) return;
    caja.innerHTML = ""; zonaR.innerHTML = "";
    misionesOraciones[misionActual].desordenada.forEach(p => {
        let span = document.createElement('span');
        span.innerText = p; span.className = 'ficha-palabra';
        span.onclick = function() { 
            if(this.parentElement.id === "caja-palabras") zonaR.appendChild(this);
            else caja.appendChild(this);
        };
        caja.appendChild(span);
    });
}

function verificarOracion() {
    const zonaR = document.getElementById('zona-respuesta');
    const userFrase = Array.from(zonaR.children).map(s => s.innerText).join(" ");
    const feedback = document.getElementById('feedback-oracion');
    
    if (userFrase === misionesOraciones[misionActual].correcta) {
        feedback.innerText = "¡Perfecto! ✨";
        feedback.className = "activar-explosion-exito";
        setTimeout(() => {
            misionActual++;
            if(misionActual < misionesOraciones.length) {
                cargarOracion();
                document.getElementById('indicador-oracion').innerText = `Misión: ${misionActual+1}/7`;
                feedback.innerText = "";
            }
        }, 2000);
    } else {
        feedback.innerText = "¡Revisa el orden! 👾";
    }
}


const textoKaraoke = "Había una vez un pequeño zorro llamado Lino que vivía en un bosque y sentía curiosidad por un lago que brillaba en la noche pero le daba un poco de miedo acercarse.Un día su amiga la ardilla Nara le dijo que fueran juntos y aunque dudó decidió intentarlo caminaron entre los árboles hasta llegar al lago.Cuando lo vieron descubrieron que no era peligroso estaba lleno de luciérnagas que iluminaban el agua.Lino sonrió y entendió que a veces lo que da miedo puede ser algo bonito si te atreves a conocerlo.";
const palabrasKaraoke = textoKaraoke.split(" ");
let recog; 
let mediaRecorder;
let fragmentosAudio = [];

function abrirKaraoke() {
    const modal = document.createElement('div');
    modal.id = 'modal-karaoke';
    modal.style = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 85%; height: 80%; background: rgba(0, 0, 0, 0.95);
        border: 3px solid #ff00ff; border-radius: 20px; z-index: 3000;
        padding: 30px; display: flex; flex-direction: column; align-items: center;
        box-shadow: 0 0 30px #ff00ff;
    `;

    modal.innerHTML = `
        <h2 style="color: #ff00ff; text-shadow: 0 0 10px #ff00ff; margin-bottom: 20px;">🎤 MODO KARAOKE LECTOR</h2>
        <div id="mic-status" style="color: #00f2ff; font-weight: bold; margin-bottom: 10px; display:none;">🔴 GRABANDO TU VOZ...</div>
        <div id="contenedor-karaoke" style="flex: 1; display: flex; flex-wrap: wrap; justify-content: center; align-content: center; gap: 10px; overflow-y: auto;"></div>
        <div id="zona-recomendaciones" style="display:none; text-align:center; color:#00f2ff; width: 100%;">
            <h3 style="font-size: 2.5rem; color: #00f2ff;">⭐ ¡MISIÓN CUMPLIDA!</h3>
            <div style="background: rgba(0, 242, 255, 0.1); border: 1px solid #00f2ff; padding: 20px; border-radius: 15px; margin: 20px auto; max-width: 600px;">
                <h4 style="color: #ff00ff; margin-top: 0;">📝 RECOMENDACIONES:</h4>
                <p style="color: white; font-size: 1.1rem;">¡Excelente voz! Recuerda respirar profundo en los puntos.</p>
            </div>
            <audio id="audio-final" controls style="margin-bottom: 25px;"></audio><br>
            <button onclick="document.getElementById('modal-karaoke').remove();" class="btn-neon">VOLVER AL MENÚ</button>
        </div>
        <div id="controles-voz" style="display: flex; gap: 15px;">
            <button id="btn-start-karaoke" class="btn-neon" onclick="iniciarLecturaKaraoke()">¡EMPEZAR A LEER!</button>
            <button id="btn-stop-karaoke" class="btn-neon" style="display:none; background:#ff4444;" onclick="finalizarLectura()">FINALIZAR</button>
        </div>
    `;

    document.body.appendChild(modal);
    const contenedor = document.getElementById('contenedor-karaoke');
    palabrasKaraoke.forEach((p, i) => {
        const span = document.createElement('span');
        span.innerText = p; span.className = 'palabra-karaoke'; span.id = `k-palabra-${i}`;
        contenedor.appendChild(span);
    });
}

async function iniciarLecturaKaraoke() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    fragmentosAudio = [];
    mediaRecorder.ondataavailable = (e) => fragmentosAudio.push(e.data);
    mediaRecorder.onstop = () => {
        const blob = new Blob(fragmentosAudio, { type: 'audio/wav' });
        document.getElementById('audio-final').src = URL.createObjectURL(blob);
    };
    mediaRecorder.start();
    recog = new SpeechRecognition(); recog.lang = 'es-MX'; recog.continuous = true; recog.interimResults = true;
    document.getElementById('btn-start-karaoke').style.display = 'none';
    document.getElementById('btn-stop-karaoke').style.display = 'block';
    document.getElementById('mic-status').style.display = 'block';
    let indexActual = 0;
    recog.onresult = (event) => {
        let textoDicho = "";
        for (let i = event.resultIndex; i < event.results.length; i++) { textoDicho += event.results[i][0].transcript.toLowerCase(); }
        palabrasKaraoke.forEach((p, i) => {
            const limpia = p.toLowerCase().replace(/[.,]/g, "");
            if (textoDicho.includes(limpia) && i >= indexActual) {
                const el = document.getElementById(`k-palabra-${i}`);
                if (el) { el.classList.add('iluminada'); indexActual = i + 1; }
            }
        });
        if (indexActual >= palabrasKaraoke.length) finalizarLectura();
    };
    recog.start();
}

function finalizarLectura() {
    if(recog) recog.stop(); if(mediaRecorder) mediaRecorder.stop();
    document.getElementById('mic-status').style.display = 'none';
    document.getElementById('btn-stop-karaoke').style.display = 'none';
    document.getElementById('contenedor-karaoke').style.display = 'none';
    document.getElementById('zona-recomendaciones').style.display = 'block';
}


function abrirActividadCuento() {
    const modalCuento = document.createElement('div');
    modalCuento.id = 'modal-actividad';
    modalCuento.style = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 90%; height: 85%; background: rgba(0, 0, 0, 0.98);
        border: 3px solid #00f2ff; border-radius: 20px; z-index: 2000;
        padding: 20px; display: flex; flex-direction: column; align-items: center;
        box-shadow: 0 0 30px #00f2ff; overflow-y: auto;
    `;
    modalCuento.innerHTML = `
        <h2 style="color: #00f2ff; text-shadow: 0 0 10px #00f2ff; margin: 0;">🐉 MISIÓN: CREADOR DE HISTORIAS ✨</h2>
        <p style="color: white; font-size: 0.9rem; margin: 10px 0;">¡Arrastra a tus amigos al lienzo morado y escribe tu aventura!</p>
        
        <div id="caja-actores" style="display: flex; gap: 15px; margin-bottom: 15px; flex-wrap: wrap; justify-content: center;">
            <div class="actor-card" draggable="true" id="actor-1" style="text-align:center; cursor:grab;">
                <img src="dragoncito.jpeg" width="60" style="pointer-events:none; border-radius:10px;">
                <p style="font-size:0.6rem; color:#00f2ff;">DRAGÓN</p>
            </div>
            <div class="actor-card" draggable="true" id="actor-2" style="text-align:center; cursor:grab;">
                <img src="hada.jpeg" width="60" style="pointer-events:none; border-radius:10px;">
                <p style="font-size:0.6rem; color:#00f2ff;">HADA</p>
            </div>
            <div class="actor-card" draggable="true" id="actor-3" style="text-align:center; cursor:grab;">
                <img src="gato.jpeg" width="60" style="pointer-events:none; border-radius:10px;">
                <p style="font-size:0.6rem; color:#00f2ff;">GATO</p>
            </div>
            <div class="actor-card" draggable="true" id="actor-4" style="text-align:center; cursor:grab;">
                <img src="soldado.jpeg" width="60" style="pointer-events:none; border-radius:10px;">
                <p style="font-size:0.6rem; color:#00f2ff;">SOLDADO</p>
            </div>
            <div class="actor-card" draggable="true" id="actor-5" style="text-align:center; cursor:grab;">
                <img src="princesa.jpeg" width="60" style="pointer-events:none; border-radius:10px;">
                <p style="font-size:0.6rem; color:#00f2ff;">PRINCESA</p>
            </div>
            <div class="actor-card" draggable="true" id="actor-6" style="text-align:center; cursor:grab;">
                <img src="bruja.jpeg" width="60" style="pointer-events:none; border-radius:10px;">
                <p style="font-size:0.6rem; color:#00f2ff;">BRUJA</p>
            </div>
            <div class="actor-card" draggable="true" id="actor-7" style="text-align:center; cursor:grab;">
                <img src="pirata.jpeg" width="60" style="pointer-events:none; border-radius:10px;">
                <p style="font-size:0.6rem; color:#00f2ff;">PIRATA</p>
            </div>
            <div class="actor-card" draggable="true" id="actor-8" style="text-align:center; cursor:grab;">
                <img src="heroe.jpeg" width="60" style="pointer-events:none; border-radius:10px;">
                <p style="font-size:0.6rem; color:#00f2ff;">HÉROE</p>
            </div>
        </div>
          <div id="lienzo-cuento" style="width: 95%; height: 120px; border: 2px dashed #ff00ff; border-radius: 15px; display: flex; justify-content: center; align-items: center; background: rgba(255, 0, 255, 0.05); margin-bottom: 15px;">
            <p id="msg-lienzo" style="color: #ff00ff; opacity: 0.6; pointer-events:none;">Suelta a los personajes aquí</p>
        </div>

        <textarea id="escritura-libre" placeholder="Había una vez..." style="width: 90%; flex: 1; background: rgba(0,0,0,0.5); border: 1px solid #00f2ff; color: white; padding: 15px; border-radius: 10px; font-size: 1.1rem; resize: none; outline: none;"></textarea>
        
        <div style="margin-top: 15px; display: flex; gap: 20px;">
            <button onclick="finalizarCuento()" class="btn-neon">¡TERMINAR CUENTO! ⭐</button>
            <button onclick="document.getElementById('modal-actividad').remove()" class="btn-neon" style="background: #444; box-shadow: none;">CERRAR</button>
        </div>
    `;

    document.body.appendChild(modalCuento);
    activarArrastreCuento();
}

function activarArrastreCuento() {
    const actores = document.querySelectorAll('.actor-card');
    const lienzo = document.getElementById('lienzo-cuento');

    actores.forEach(actor => {
        actor.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.currentTarget.id);
        });
    });

    lienzo.addEventListener('dragover', (e) => {
        e.preventDefault();
        lienzo.style.boxShadow = "0 0 20px #ff00ff";
    });

    lienzo.addEventListener('dragleave', () => {
        lienzo.style.boxShadow = "none";
    });

    lienzo.addEventListener('drop', (e) => {
        e.preventDefault();
        lienzo.style.boxShadow = "none";
        
        const id = e.dataTransfer.getData('text/plain');
        const original = document.getElementById(id);
        
        if (original) {
            const clon = original.querySelector('img').cloneNode(true);
            clon.style = "width:70px; height:70px; margin:5px; border-radius:10px; border: 2px solid #00f2ff;";
            
            if (lienzo.innerText.includes("Suelta a los personajes aquí")) {
                lienzo.innerHTML = ""; 
            }
            
            lienzo.appendChild(clon);
        }
    });
}

function finalizarCuento() {
    const modal = document.getElementById('modal-actividad');
    modal.innerHTML = `<div style="text-align:center; padding:40px;"><h1 style="color:#00f2ff;">✨ ¡INCREÍBLE!</h1><button onclick="document.getElementById('modal-actividad').remove()" class="btn-neon">VOLVER AL MENÚ</button></div>`;
}


document.querySelectorAll('.btn-circular').forEach(boton => {
    boton.addEventListener('click', () => {
        const textoBoton = boton.innerText.trim();
        if (textoBoton.includes("REPASO")) abrirActividadCuento();
        else if (textoBoton.includes("NIVEL 1")) abrirKaraoke();
        else if (textoBoton.includes("AUDIO")) abrirCuentoAudio();
    });
});

document.querySelectorAll('.nodo-esquema').forEach(d => {
    d.addEventListener('toggle', () => {
        const zoey = document.getElementById('zoey-main');
        if(zoey) zoey.style.display = Array.from(document.querySelectorAll('.nodo-esquema')).some(e => e.open) ? "none" : "block";
    });
});

window.onload = cargarOracion;

function abrirCuentoAudio() {
    const nuevaVentana = window.open("", "_blank");
    nuevaVentana.document.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Cuento: Los Animales del Bosque</title>
            <style>
                body { background: #0a0a0a; color: white; font-family: 'Segoe UI', sans-serif; padding: 40px; text-align: center; line-height: 1.8; }
                .cuento-container { max-width: 800px; margin: auto; background: rgba(255,255,255,0.05); padding: 30px; border-radius: 20px; border: 2px solid #ff00ff; box-shadow: 0 0 20px #ff00ff55; }
                h1 { color: #00f2ff; text-shadow: 0 0 10px #00f2ff; }
                .palabra-clave { color: #ff00ff; font-weight: bold; cursor: pointer; text-decoration: underline; transition: 0.3s; }
                .palabra-clave:hover { color: #00f2ff; text-shadow: 0 0 10px #00f2ff; }
                #significado-box { margin-top: 30px; padding: 15px; border: 1px dashed #00f2ff; border-radius: 10px; color: #00f2ff; font-style: italic; min-height: 50px; }
                .btn-volver { margin-top: 30px; background: #ff00ff; color: white; border: none; padding: 15px 30px; border-radius: 10px; cursor: pointer; font-weight: bold; box-shadow: 0 0 10px #ff00ff; transition: 0.3s; }
                .btn-volver:hover { transform: scale(1.05); box-shadow: 0 0 20px #ff00ff; }
            </style>
        </head>
        <body>
            <div class="cuento-container">
                <h1>Los animales del bosque</h1>
                <p>En el bosque viven muchos animales que forman un <span class="palabra-clave" onclick="mostrar('Ecosistema: conjunto de seres vivos y su entorno.')">ecosistema</span>. Cada uno cumple una función importante para mantener el <span class="palabra-clave" onclick="mostrar('Equilibrio: estado en el que todo funciona bien.')">equilibrio</span>.</p>
                <p>Por ejemplo, los conejos comen plantas y son <span class="palabra-clave" onclick="mostrar('Herbívoro: animal que come plantas.')">herbívoros</span>, mientras que los zorros son <span class="palabra-clave" onclick="mostrar('Carnívoro: animal que come carne.')">carnívoros</span> porque comen otros animales.</p>
                <p>Los árboles son muy importantes porque producen <span class="palabra-clave" onclick="mostrar('Oxígeno: aire que respiramos.')">oxígeno</span>. Además, dan <span class="palabra-clave" onclick="mostrar('Refugio: lugar donde los animales viven o se protegen.')">refugio</span> a muchos animales. Cuidar el bosque ayuda a conservar la <span class="palabra-clave" onclick="mostrar('Biodiversidad: variedad de seres vivos en un lugar.')">biodiversidad</span>.</p>
                <div id="significado-box">Haz clic en las palabras resaltadas para ver su significado</div>
                <button class="btn-volver" onclick="window.close()">VOLVER AL MENÚ / FINALIZAR</button>
            </div>
            <script>function mostrar(t){document.getElementById('significado-box').innerText=t;}<\/script>
        </body>
        </html>
    `);
}



function abrirRetosAgente() {
    const ventanaRetos = window.open("", "_blank");
    ventanaRetos.document.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Misión: Agente Lector</title>
            <style>
                body { background: #000; color: #00f2ff; font-family: 'Courier New', monospace; padding: 30px; text-align: center; }
                .terminal { border: 2px solid #00f2ff; padding: 20px; border-radius: 15px; max-width: 700px; margin: auto; box-shadow: 0 0 20px #00f2ff33; position: relative; }
                h1 { color: #ff00ff; text-shadow: 0 0 10px #ff00ff; margin-top: 0; }
                .instrucciones-box { background: rgba(0, 242, 255, 0.1); border: 1px dashed #00f2ff; padding: 15px; margin-bottom: 20px; text-align: left; font-size: 0.9rem; color: #fff; }
                .nivel-info { font-size: 1.2rem; margin-bottom: 20px; color: #00f2ff; font-weight: bold; }
                .oracion { font-size: 1.8rem; margin: 30px 0; background: #111; padding: 25px; border-radius: 10px; border-left: 5px solid #ff00ff; }
                .opciones { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; }
                .btn-opcion { background: none; border: 2px solid #ff00ff; color: #ff00ff; padding: 15px 40px; font-size: 1.5rem; cursor: pointer; transition: 0.3s; border-radius: 8px; font-weight: bold; }
                .btn-opcion:hover { background: #ff00ff; color: #000; box-shadow: 0 0 15px #ff00ff; }
                #feedback-mision { margin-top: 30px; font-weight: bold; font-size: 1.3rem; min-height: 1.5em; text-transform: uppercase; }
                .btn-volver { margin-top: 40px; background: #444; color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 5px; }
            </style>
        </head>
        <body>
            <div class="terminal">
                <h1>🕵️ ACCESO: AGENTE LECTOR</h1>
                
                <div id="pantalla-instrucciones">
                    <div class="instrucciones-box">
                        <p><strong>INSTRUCCIONES DE LA MISIÓN:</strong></p>
                        <ol>
                            <li>Lee la oración secreta en pantalla.</li>
                            <li>Falta una pieza (letras) para completar la palabra correctamente.</li>
                            <li>Selecciona el botón con la letra correcta para descifrar el código.</li>
                            <li>¡Completa las 10 misiones para salvar la base!</li>
                        </ol>
                    </div>
                    <button class="btn-opcion" onclick="iniciarMision()">ENTIENDO, ¡INICIAR! 🚀</button>
                </div>

                <div id="pantalla-juego" style="display:none;">
                    <div id="mision-header" class="nivel-info"></div>
                    <div id="frase-mision" class="oracion"></div>
                    <div id="botones-opciones" class="opciones"></div>
                    <div id="feedback-mision"></div>
                </div>
            </div>
            <br>
            <button class="btn-volver" onclick="window.close()">ABORTAR (CERRAR)</button>

            <script>
                const retos = [
                    { oracion: "El agente es muy cap__ con la tecnología.", opciones: ["as", "az"], correcta: "az", msg: "¡Impresionante! 'Capaz' con Z dominado." },
                    { oracion: "Debes __ojear el expediente con cuidado.", opciones: ["h", " "], correcta: "h", msg: "¡Exacto! 'Hojear' (de pasar hojas) lleva H." },
                    { oracion: "El __ello del sobre tiene un código.", opciones: ["s", "z"], correcta: "s", msg: "¡Perfecto! El 'sello' de seguridad está listo." },
                    { oracion: "La misión es __erigir la nueva torre.", opciones: ["e", "i"], correcta: "e", msg: "¡Logrado! 'Erigir' es la clave del éxito." },
                    { oracion: "Cuidado con la __erida del guerrero.", opciones: ["h", " "], correcta: "h", msg: "¡Bien hecho! Sanaste la 'herida' correctamente." },
                    { oracion: "El __igante despertó en el bosque.", opciones: ["g", "j"], correcta: "g", msg: "¡Misión cumplida! El Gigante es aliado ahora." },
                    { oracion: "Hay que __erbir el agua en la base.", opciones: ["h", " "], correcta: "h", msg: "¡Excelente! 'Hervir' con H es indispensable." },
                    { oracion: "El __unque de energía está cargado.", opciones: ["y", "ll"], correcta: "y", msg: "¡Brillante! 'Yunque' con Y activado." },
                    { oracion: "Fue un __echo histórico para la paz.", opciones: ["h", " "], correcta: "h", msg: "¡Correcto! El 'hecho' (suceso) siempre lleva H." },
                    { oracion: "El espía va a __ecibir su recompensa.", opciones: ["r", "n"], correcta: "r", msg: "¡MAESTRO LECTOR! Has completado todas las misiones." }
                ];

                let n = 0;

                function iniciarMision() {
                    document.getElementById('pantalla-instrucciones').style.display = 'none';
                    document.getElementById('pantalla-juego').style.display = 'block';
                    cargar();
                }

                function cargar() {
                    const r = retos[n];
                    document.getElementById('mision-header').innerText = "MISIÓN " + (n + 1) + " DE 10";
                    document.getElementById('frase-mision').innerText = r.oracion;
                    const b = document.getElementById('botones-opciones');
                    b.innerHTML = "";
                    
                    r.opciones.forEach(o => {
                        const btn = document.createElement('button');
                        btn.innerText = (o === " ") ? "[SIN H]" : o; 
                        btn.className = 'btn-opcion';
                        btn.onclick = () => {
                            const f = document.getElementById('feedback-mision');
                            if(o === r.correcta) {
                                f.style.color = "#00f2ff"; 
                                f.innerText = "✅ " + r.msg;
                                setTimeout(() => { 
                                    n++; 
                                    if(n < retos.length) { 
                                        f.innerText = ""; 
                                        cargar(); 
                                    } else { 
                                        document.getElementById('pantalla-juego').innerHTML = "<h2 style='color:#ff00ff;'>🏆 ¡OPERACIÓN EXITOSA!</h2><p>Eres el mejor Agente Lector del mundo.</p>"; 
                                    } 
                                }, 2000);
                            } else { 
                                f.style.color = "#ff00ff"; 
                                f.innerText = "❌ ¡CÓDIGO ERRÓNEO! REINTENTANDO..."; 
                            }
                        };
                        b.appendChild(btn);
                    });
                }

                // --- SECCIÓN NUEVA: EL INTRUSO DEL VOCABULARIO ---
// Definimos las misiones del intruso
const misionesIntruso = [
    {
        texto: "La estrella de K-Pop baila en el escenario con su micrófono pizza mientras los fans graban con luces.",
        intrusas: ["pizza"],
        exito: "¡Virus eliminado! 🍕",
        error: "Esa palabra es correcta. ¡Busca el error!"
    },
    {
        texto: "El agente secreto usa un teclado de calcetín para entrar a la base de helado y salvar el mundo.",
        intrusas: ["calcetín", "helado"],
        exito: "¡Sistema limpio! 🧦🍦",
        error: "¡Interferencia! Sigue buscando."
    }
];

let faseIntruso = 0;

// Función para cargar el juego dentro de tu modal de Retos existente
function iniciarJuegoIntruso() {
    const data = misionesIntruso[faseIntruso];
    const contenedor = document.getElementById('opciones-reto');
    const textoMision = document.getElementById('texto-reto');
    const feedback = document.getElementById('msg-feedback');
    
    // Limpiamos el área de juego
    contenedor.innerHTML = "";
    feedback.innerText = "";
    textoMision.innerText = "¡TOCA LAS PALABRAS QUE NO DEBERÍAN ESTAR!";

    // Convertimos el texto en palabras clickeables
    data.texto.split(" ").forEach(palabra => {
        const span = document.createElement('span');
        const palabraLimpia = palabra.toLowerCase().replace(/[.,]/g, "");
        span.innerText = palabra + " ";
        span.className = 'palabra-click'; // Usa el CSS que ya pegaste
        
        span.onclick = () => {
            if (data.intrusas.includes(palabraLimpia)) {
                span.classList.add('palabra-detectada');
                // Si encontramos todos los intrusos del nivel
                const encontradas = document.querySelectorAll('.palabra-detectada').length;
                if (encontradas === data.intrusas.length) {
                    feedback.innerText = data.exito;
                    setTimeout(() => {
                        faseIntruso++;
                        if (faseIntruso < misionesIntruso.length) iniciarJuegoIntruso();
                        else cerrarMision(); // Usamos tu función de cerrar
                    }, 2000);
                }
            } else {
                feedback.innerText = data.error;
            }
        };
        contenedor.appendChild(span);
    });
}


            <\script>
            <div id="modal-retos-nuevo" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:10000; justify-content:center; align-items:center; backdrop-filter: blur(10px);">
    <div class="panel" style="width:90%; max-width:500px; height:auto; border:3px solid #00f2ff; box-shadow: 0 0 30px #00f2ff; background: #000; padding: 25px; text-align: center;">
        <h2 id="titulo-mision" style="color:#ff00ff; text-shadow: 0 0 10px #ff00ff;">MISIÓN: AGENTE LECTOR</h2>
        <p id="progreso-reto" style="color:#00f2ff; font-weight:bold;"></p>
        
        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px; margin: 20px 0;">
            <p id="texto-reto" style="font-size:1.5rem; color:white; min-height:50px;"></p>
            <div id="opciones-reto" style="display:flex; justify-content:center; gap:15px; flex-wrap:wrap; margin-top:20px;"></div>
        </div>
        
        <p id="msg-feedback" style="min-height:30px; font-weight:bold;"></p>
        <button onclick="cerrarMision()" style="margin-top:20px; background:#444; color:white; border:none; padding:10px; cursor:pointer; border-radius:5px;">ABORTAR MISIÓN</button>
    </div>
</div>


        </body>
        </html>
    `);
}

function abrirMisionRetos() {
    document.getElementById('modal-retos').style.display = 'flex';
    
    console.log("Misión iniciada, Agente");
}


function cerrarMisionRetos() {
    document.getElementById('modal-retos').style.display = 'none';
}

