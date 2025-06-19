import { useReactMediaRecorder } from "react-media-recorder";

const MediaRecorder = ({ onSave, type = "audio" }) => {
  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    clearBlobUrl
  } = useReactMediaRecorder({
    audio: true,
    video: type === "video",
    blobPropertyBag: { type: `${type === "audio" ? 'audio/mp3' : 'video/mp4'}` }
  });

  const handleSave = () => {
    if (mediaBlobUrl) {
      // Ici vous pourriez envoyer le blob à votre backend
      fetch(mediaBlobUrl)
        .then(res => res.blob())
        .then(blob => {
          onSave(blob);
          clearBlobUrl();
        });
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <div className="flex justify-between mb-4">
        <span className="text-sm font-medium">
          {type === "audio" ? "Enregistrement Audio" : "Enregistrement Vidéo"}
        </span>
        <span className="text-xs text-gray-500">{status}</span>
      </div>

      <div className="flex space-x-2 mb-4">
        <button
          onClick={startRecording}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm"
          disabled={status === "recording"}
        >
          Démarrer
        </button>
        <button
          onClick={stopRecording}
          className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
          disabled={status !== "recording"}
        >
          Arrêter
        </button>
      </div>

      {mediaBlobUrl && (
        <div className="mb-4">
          {type === "audio" ? (
            <audio src={mediaBlobUrl} controls className="w-full" />
          ) : (
            <video src={mediaBlobUrl} controls className="w-full max-h-64" />
          )}
        </div>
      )}

      {mediaBlobUrl && (
        <div className="flex justify-end space-x-2">
          <button
            onClick={clearBlobUrl}
            className="text-gray-500 px-3 py-1 rounded text-sm"
          >
            Effacer
          </button>
          <button
            onClick={handleSave}
            className="bg-purple-500 text-white px-3 py-1 rounded text-sm"
          >
            Enregistrer
          </button>
        </div>
      )}
    </div>
  );
};

export default MediaRecorder;