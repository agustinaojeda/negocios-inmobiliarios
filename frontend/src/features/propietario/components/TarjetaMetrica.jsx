import React from "react";

export default function TarjetaMetrica({ titulo, valor, subtitulo, colorBorde = "primary" }) {
  return (
    <div className="col-12 col-sm-6 col-lg-3">
      <div className={`card border-1 shadow-sm rounded-3 p-3 h-100 border-${colorBorde}`}>
        <span className="text-muted small text-uppercase fw-semibold">{titulo}</span>
        <div className={`fs-2 fw-bold text-${colorBorde} mt-1`}>{valor}</div>
        {subtitulo && <span className="small text-muted">{subtitulo}</span>}
      </div>
    </div>
  );
}