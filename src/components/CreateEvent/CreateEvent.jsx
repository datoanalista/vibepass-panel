'use client';

import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEventForm } from './hooks/useEventForm';
import InformacionGeneral from './steps/InformacionGeneral';
import ConfiguracionEntradas from './steps/ConfiguracionEntradas';
import AlimentosBebestibles from './steps/AlimentosBebestibles';
import Actividades from './steps/Actividades';
import DatosOrganizador from './steps/DatosOrganizador';

const CreateEvent = ({ onClose }) => {
  const {
    // Estado
    createEventStep,
    eventFormData,
    uploadStates,
    createEventState,
    draftSaveState,
    formLoadingState,
    isEditMode,
    editingEventId,
    
    // Funciones de navegación
    handleFormChange,
    handleNextStep,
    handlePrevStep,
    handleCloseForm,
    
    // Validaciones
    isStep1Valid,
    isStep2Valid,
    isStep3Valid,
    isStep4Valid,
    isStep5Valid,
    canSaveDraft,
    
    // CRUD Entradas
    addEntrada,
    updateEntrada,
    deleteEntrada,
    
    // CRUD Alimentos
    addAlimento,
    updateAlimento,
    deleteAlimento,
    
    // CRUD Actividades
    addActividad,
    updateActividad,
    deleteActividad,
    
    // Generación de JSON
    generateEventJSON,
    
    // Upload de archivos
    uploadBanner,
    uploadProductImage,
    uploadActivityImage,
    
    // Creación de evento
    createEvent,
    saveAsDraft,
    closeSuccessModal,
    resetCreateEventError,
  } = useEventForm();

  // Override del handleCloseForm para notificar al componente padre
  const handleClose = () => {
    handleCloseForm();
    onClose && onClose();
  };

  // Renderizar el paso correspondiente
  const renderCurrentStep = () => {
    switch (createEventStep) {
      case 1:
        return (
          <InformacionGeneral 
            eventFormData={eventFormData}
            handleFormChange={handleFormChange}
            handleCloseForm={handleClose}
            handleNextStep={handleNextStep}
            isStep1Valid={isStep1Valid}
            uploadBanner={uploadBanner}
            uploadStates={uploadStates}
            isEditMode={isEditMode}
            canSaveDraft={canSaveDraft}
            saveAsDraft={saveAsDraft}
            draftSaveState={draftSaveState}
          />
        );
      case 2:
        return (
          <ConfiguracionEntradas 
            eventFormData={eventFormData}
            addEntrada={addEntrada}
            updateEntrada={updateEntrada}
            deleteEntrada={deleteEntrada}
            handleCloseForm={handleClose}
            handleNextStep={handleNextStep}
            handlePrevStep={handlePrevStep}
            isStep2Valid={isStep2Valid}
            isEditMode={isEditMode}
            canSaveDraft={canSaveDraft}
            saveAsDraft={saveAsDraft}
            draftSaveState={draftSaveState}
          />
        );
      case 3:
        return (
          <AlimentosBebestibles 
            eventFormData={eventFormData}
            addAlimento={addAlimento}
            updateAlimento={updateAlimento}
            deleteAlimento={deleteAlimento}
            handleCloseForm={handleClose}
            handleNextStep={handleNextStep}
            handlePrevStep={handlePrevStep}
            isStep3Valid={isStep3Valid}
            uploadProductImage={uploadProductImage}
            uploadStates={uploadStates}
            isEditMode={isEditMode}
            canSaveDraft={canSaveDraft}
            saveAsDraft={saveAsDraft}
            draftSaveState={draftSaveState}
          />
        );
      case 4:
        return (
          <Actividades 
            eventFormData={eventFormData}
            addActividad={addActividad}
            updateActividad={updateActividad}
            deleteActividad={deleteActividad}
            handleCloseForm={handleClose}
            handleNextStep={handleNextStep}
            handlePrevStep={handlePrevStep}
            isStep4Valid={isStep4Valid}
            uploadActivityImage={uploadActivityImage}
            uploadStates={uploadStates}
            isEditMode={isEditMode}
            canSaveDraft={canSaveDraft}
            saveAsDraft={saveAsDraft}
            draftSaveState={draftSaveState}
          />
        );
      case 5:
        return (
          <DatosOrganizador 
            eventFormData={eventFormData}
            handleFormChange={handleFormChange}
            handleCloseForm={handleClose}
            handlePrevStep={handlePrevStep}
            isStep5Valid={isStep5Valid}
            generateEventJSON={generateEventJSON}
            createEvent={createEvent}
            createEventState={createEventState}
            closeSuccessModal={closeSuccessModal}
            resetCreateEventError={resetCreateEventError}
            isEditMode={isEditMode}
            canSaveDraft={canSaveDraft}
            saveAsDraft={saveAsDraft}
            draftSaveState={draftSaveState}
          />
        );
      default:
        return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {formLoadingState.loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="text-gray-700">{formLoadingState.message}</span>
          </div>
        </div>
      )}
      {renderCurrentStep()}
    </LocalizationProvider>
  );
};

export default CreateEvent;
