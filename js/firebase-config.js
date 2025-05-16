// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, doc, updateDoc, increment, getDoc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
import { firebaseConfig } from './config.js';

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Funciones para manejar la configuración del sistema
export const obtenerConfiguracion = async () => {
    try {
        const configRef = doc(db, "configuracion", "sistema");
        const configDoc = await getDoc(configRef);
        
        if (!configDoc.exists()) {
            // Crear configuración por defecto si no existe
            await setDoc(configRef, {
                nominacionesActivas: true,
                votacionesActivas: false,
                mensajeSistema: "Las nominaciones están abiertas",
                mensajeVotaciones: "Las votaciones están cerradas",
                fechaLimite: null
            });
            return {
                nominacionesActivas: true,
                votacionesActivas: false,
                mensajeSistema: "Las nominaciones están abiertas",
                mensajeVotaciones: "Las votaciones están cerradas",
                fechaLimite: null
            };
        }
        
        return configDoc.data();
    } catch (error) {
        console.error("Error al obtener configuración:", error);
        throw error;
    }
};

export const actualizarConfiguracion = async (nuevaConfig) => {
    try {
        const configRef = doc(db, "configuracion", "sistema");
        await updateDoc(configRef, nuevaConfig);
    } catch (error) {
        console.error("Error al actualizar configuración:", error);
        throw error;
    }
};

// Funciones para manejar nominaciones
export const agregarNominacion = async (nominacion) => {
    try {
        // Verificar si las nominaciones están activas
        const config = await obtenerConfiguracion();
        if (!config.nominacionesActivas) {
            throw new Error("Las nominaciones están cerradas en este momento");
        }

        const docRef = await addDoc(collection(db, "nominaciones"), {
            ...nominacion,
            fecha: new Date(),
            votos: 0,
            estado: "pendiente"
        });
        return docRef.id;
    } catch (error) {
        console.error("Error al agregar nominación:", error);
        throw error;
    }
};

export const obtenerNominaciones = async () => {
    try {
        const q = query(collection(db, "nominaciones"), orderBy("fecha", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error al obtener nominaciones:", error);
        throw error;
    }
};

export const eliminarNominacion = async (id) => {
    try {
        const nominacionRef = doc(db, "nominaciones", id);
        await deleteDoc(nominacionRef);
    } catch (error) {
        console.error("Error al eliminar nominación:", error);
        throw error;
    }
};

// Funciones para manejar votos
export const agregarVoto = async (nominacionId) => {
    try {
        const nominacionRef = doc(db, "nominaciones", nominacionId);
        await updateDoc(nominacionRef, {
            votos: increment(1)
        });
    } catch (error) {
        console.error("Error al agregar voto:", error);
        throw error;
    }
};

// Funciones para manejar ediciones anteriores
export const obtenerEdicionesAnteriores = async () => {
    try {
        const q = query(collection(db, "ediciones"), orderBy("año", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error al obtener ediciones anteriores:", error);
        throw error;
    }
};

// Funciones para Ediciones Anteriores
export const obtenerEdiciones = async () => {
    try {
        const edicionesRef = collection(db, 'ediciones');
        const q = query(edicionesRef, orderBy('fecha', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error al obtener ediciones:', error);
        throw error;
    }
};

export const agregarEdicion = async (edicion) => {
    try {
        const edicionesRef = collection(db, 'ediciones');
        const docRef = await addDoc(edicionesRef, {
            ...edicion,
            fecha: new Date()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error al agregar edición:', error);
        throw error;
    }
};

export const eliminarEdicion = async (id) => {
    try {
        const edicionRef = doc(db, 'ediciones', id);
        await deleteDoc(edicionRef);
    } catch (error) {
        console.error('Error al eliminar edición:', error);
        throw error;
    }
};

// Funciones para manejar ganadores
export const obtenerGanadores = async () => {
    try {
        const ganadoresRef = collection(db, "ganadores");
        const q = query(ganadoresRef, orderBy("fecha", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error al obtener ganadores:", error);
        throw error;
    }
};

export const agregarGanador = async (ganador) => {
    try {
        const ganadoresRef = collection(db, "ganadores");
        const docRef = await addDoc(ganadoresRef, {
            ...ganador,
            fecha: new Date()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error al agregar ganador:", error);
        throw error;
    }
};

export const eliminarGanador = async (id) => {
    try {
        const ganadorRef = doc(db, "ganadores", id);
        await deleteDoc(ganadorRef);
    } catch (error) {
        console.error("Error al eliminar ganador:", error);
        throw error;
    }
};
 