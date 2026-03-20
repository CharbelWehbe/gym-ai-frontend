import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import "./ScanPage.css";

const ScanPage = () => {
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const hasScannedRef = useRef(false);

  const [status, setStatus] = useState("Point your camera at the QR code.");
  const [error, setError] = useState("");
  const [scannerStarted, setScannerStarted] = useState(false);

  // Enforce login to scan
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login?next=/scan");
    }
  }, [navigate]);

  // Show HTTPS tip for mobile
  const insecure =
    typeof window !== "undefined" &&
    window.location.protocol !== "https:" &&
    window.location.hostname !== "localhost";

  useEffect(() => {
    if (!scannerStarted) return;

    let isMounted = true;
    hasScannedRef.current = false;

    const config = {
      fps: 12,
      qrbox: { width: 260, height: 260 },
      rememberLastUsedCamera: true,
      facingMode: "environment",
    };

    const scanner = new Html5QrcodeScanner("qr-reader", config, false);
    scannerRef.current = scanner;

    const onScanSuccess = (decodedText) => {
      if (!isMounted || hasScannedRef.current) return;
      hasScannedRef.current = true;

      const scanType = detectScanType(decodedText);

      // 🔹 1) ENTRY QR → go to today's workout
      if (scanType === "entry") {
        setStatus("Entry scanned. Opening today’s workout...");
        vibrateShort();

        scanner
          .clear()
          .catch(() => {})
          .finally(() => {
            scannerRef.current = null;
            navigate("/today-workout");
          });
        return;
      }

      // 🔹 2) EXIT QR → just show a message (you can later log session)
      if (scanType === "exit") {
        setStatus("Exit scanned. Have a great day!");
        vibrateShort();
        hasScannedRef.current = false; // let them scan again if they want
        return;
      }

      // 🔹 3) MACHINE QR → send code to TodayWorkout
      const machineCode = extractMachineCode(decodedText);

      if (machineCode) {
        setStatus("Machine QR recognized. Opening exercise...");
        vibrateShort();

        scanner
          .clear()
          .catch(() => {})
          .finally(() => {
            scannerRef.current = null;
            navigate(
              `/today-workout?machineCode=${encodeURIComponent(
                machineCode
              )}`
            );
          });
      } else {
        setError(
          "Invalid QR code. Expected gym entry/exit or a machine code."
        );
        hasScannedRef.current = false;
      }
    };

    const onScanError = () => {
      // ignore continuous read errors
    };

    scanner.render(onScanSuccess, onScanError);

    return () => {
      isMounted = false;
      if (scannerRef.current) {
        scannerRef.current
          .clear()
          .catch(() => {})
          .finally(() => {
            scannerRef.current = null;
          });
      }
    };
  }, [scannerStarted, navigate]);

  const handleStartCamera = () => {
    setError("");
    setStatus("Point your camera at the QR code.");
    setScannerStarted(true);
  };

  return (
    <div className="scan-page">
      <div className="scan-card">
        <h2 className="scan-title">Scan QR</h2>
        <p className="scan-subtitle">
          • Scan <b>GYM ENTRY</b> QR when you arrive. <br />
          • Scan a <b>machine QR</b> (e.g. leg-press) to open that exercise.
        </p>

        {insecure && (
          <div className="scan-notice">
            Camera access requires <b>HTTPS</b>. Use HTTPS or <b>localhost</b>.
          </div>
        )}

        <div id="qr-reader"></div>

        {!scannerStarted && (
          <button
            type="button"
            className="scan-btn"
            style={{ marginTop: "12px", marginBottom: "8px" }}
            onClick={handleStartCamera}
          >
            Start camera
          </button>
        )}

        {status && <p className="scan-status">{status}</p>}
        {error && <p className="scan-error">⚠ {error}</p>}
      </div>
    </div>
  );
};

// 🔍 Recognise type of QR text
function detectScanType(text) {
  if (!text) return "unknown";
  const t = text.toString().trim().toUpperCase();

  if (t === "GYM_ENTRY" || t === "GYM-ENTRY") return "entry";
  if (t === "GYM_EXIT" || t === "GYM-EXIT") return "exit";

  return "machine";
}

// 🧩 Turn QR text into a machine code string
function extractMachineCode(text) {
  if (!text) return null;
  const cleaned = text.trim();

  // if someone encoded a full URL with ?machineCode=...
  try {
    const url = new URL(cleaned);
    const params = url.searchParams || new URLSearchParams(url.search);
    const mc = params.get("machineCode");
    if (mc) return mc.toLowerCase();
  } catch {
    // not a URL → ignore
  }

  // otherwise just treat the whole text as the slug (e.g. "leg-press")
  return cleaned.toLowerCase();
}

function vibrateShort() {
  if (
    typeof navigator !== "undefined" &&
    typeof navigator.vibrate === "function"
  ) {
    navigator.vibrate(30);
  }
}

export default ScanPage;
