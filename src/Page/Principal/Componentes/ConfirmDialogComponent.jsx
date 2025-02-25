// ConfirmDialogComponent.js
import React from 'react';
import { confirmDialog } from 'primereact/confirmdialog';

const ConfirmDialogComponent = ({ showDialog, message, header, onConfirm, onReject }) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const handleReject = () => {
    onReject();
  };

  // Renderizar el dialogo solo si showDialog es true
  if (showDialog) {
    confirmDialog({
      message: message || '¿Estás seguro?',
      header: header || 'Confirmar acción',
      icon: 'pi pi-exclamation-triangle',
      accept: handleConfirm,
      reject: handleReject,
    });
  }

  return null;
};

export default ConfirmDialogComponent;
