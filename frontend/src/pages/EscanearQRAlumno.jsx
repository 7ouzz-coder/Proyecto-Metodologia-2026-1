import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@context/AuthContext';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import axios from '@services/root.service.js';

export default function EscanearQRAlumno() {
  const { user } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [asistenciaMarcada, setAsistenciaMarcada] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanMode, setScanMode] = useState('camera'); // 'camera' o 'file'
  const qrScannerRef = useRef(null);
  const hasInitialized = useRef(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.clear().catch(err => console.log('Error al limpiar scanner:', err));
        qrScannerRef.current = null;
      }
    };
  }, []);

  const procesarQREscaneado = async (decodedText) => {
    try {
      const data = JSON.parse(decodedText);
      if (data.claseId) {
        setLoading(true);
        try {
          const response = await axios.post('/asistencia/marcar', { claseId: data.claseId });
          setAsistenciaMarcada(true);
          if (qrScannerRef.current) {
            qrScannerRef.current.clear().catch(console.error);
            qrScannerRef.current = null;
          }
          setScanning(false);
          hasInitialized.current = false;
        } catch (apiError) {
          setError(apiError.response?.data?.message || 'Error al registrar asistencia en el servidor');
        } finally {
          setLoading(false);
        }
      } else {
        setError('El código QR no pertenece a una clase válida');
      }
    } catch (err) {
      setError('Error al leer el código QR. Asegúrate de escanear el QR generado por el profesor.');
    }
  };

  const iniciarEscaneo = () => {
    if (qrScannerRef.current || hasInitialized.current) return;
    setScanning(true);
    setError('');
    setAsistenciaMarcada(false);
    hasInitialized.current = true;

    setTimeout(() => {
      try {
        const element = document.getElementById('qr-reader');
        if (!element) {
          setError('Error al inicializar el escáner');
          setScanning(false);
          hasInitialized.current = false;
          return;
        }
        const scanner = new Html5QrcodeScanner(
          'qr-reader',
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            showTorchButtonIfSupported: true,
            showZoomSliderIfSupported: true
          },
          false
        );
        qrScannerRef.current = scanner;

        const onScanSuccess = (decodedText) => {
          procesarQREscaneado(decodedText);
        };
        scanner.render(onScanSuccess, () => {});
      } catch (err) {
        setError('Error al inicializar la cámara. Verifica los permisos del navegador.');
        setScanning(false);
        hasInitialized.current = false;
      }
    }, 100);
  };

  const detenerEscaneo = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.clear().catch(console.error);
      qrScannerRef.current = null;
    }
    setScanning(false);
    hasInitialized.current = false;
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError('');
    setAsistenciaMarcada(false);
    setLoading(true);

    try {
      const html5QrCode = new Html5Qrcode('qr-file-reader');
      const decodedText = await html5QrCode.scanFile(file, true);
      await procesarQREscaneado(decodedText);
      await html5QrCode.clear();
    } catch (err) {
      setError('No se pudo detectar un código QR válido en la imagen seleccionada');
      setLoading(false);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="card bg-base-100 shadow-xl p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">Registrar Asistencia</h1>
        <p className="text-gray-600 mb-4">Alumno: <strong>{user?.nombre}</strong></p>
        <p className="text-sm text-gray-500">Escanea el código QR proporcionado por el profesor para quedar presente en la clase.</p>
      </div>

      {error && <div className="alert alert-error mb-6 shadow-lg"><span><strong>Error:</strong> {error}</span></div>}

      <div className="card bg-base-100 shadow-xl p-6">
        {!scanning && !asistenciaMarcada && (
          <div className="flex gap-4 mb-6 p-2 bg-base-200 rounded-lg">
            <button 
              onClick={() => setScanMode('camera')} 
              className={`btn flex-1 ${scanMode === 'camera' ? 'btn-primary' : 'btn-ghost'}`}
            >
              📷 Cámara
            </button>
            <button 
              onClick={() => setScanMode('file')} 
              className={`btn flex-1 ${scanMode === 'file' ? 'btn-primary' : 'btn-ghost'}`}
            >
              📁 Archivo
            </button>
          </div>
        )}

        {/* Modo cámara */}
        {scanMode === 'camera' && !scanning && !asistenciaMarcada && (
          <div className="text-center">
            <div className="py-12 bg-base-200 rounded-lg border-2 border-dashed border-base-300 mb-4">
              <div className="text-5xl mb-4">📷</div>
              <p className="text-gray-500">Haz clic en el botón para activar la cámara</p>
            </div>
            <button onClick={iniciarEscaneo} className="btn btn-primary w-full">Iniciar Escaneo</button>
          </div>
        )}

        {/* Modo archivo */}
        {scanMode === 'file' && !asistenciaMarcada && (
          <div className="text-center">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="qr-file-input" />
            <div id="qr-file-reader" className="hidden"></div>
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="btn btn-primary w-full" 
              disabled={loading}
            >
              {loading ? 'Procesando QR...' : 'Seleccionar Imagen con QR'}
            </button>
          </div>
        )}

        {/* Escáner Activo */}
        {scanning && (
          <div>
            <div id="qr-reader" className="w-full border-2 border-base-300 rounded-lg overflow-hidden"></div>
            <button onClick={detenerEscaneo} className="btn btn-error w-full mt-4 text-white">Detener Escaneo</button>
          </div>
        )}

        {/* Éxito */}
        {asistenciaMarcada && (
          <div className="text-center">
            <div className="py-10 px-4 bg-success/20 rounded-lg border-2 border-success/30 mb-6">
              <div className="text-6xl text-success mb-4">✓</div>
              <h3 className="text-xl font-bold text-success-content">¡Presente!</h3>
              <p className="text-success-content/80 mt-2">Tu asistencia ha sido registrada exitosamente para esta clase.</p>
            </div>
          </div>
        )}

        {loading && !asistenciaMarcada && scanMode === 'camera' && (
          <div className="mt-4 text-center">
            <span className="loading loading-spinner text-primary"></span>
            <p className="text-sm mt-2 text-gray-500">Registrando asistencia...</p>
          </div>
        )}
      </div>
    </div>
  );
}
