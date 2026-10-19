import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import { saveMediaItem } from '../../services/dataService';
import { Upload, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface MediaUploaderProps {
  onUploadSuccess: (url: string, title: string) => void;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [altText, setAltText] = useState('');
  const [category, setCategory] = useState('Consulting');
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Manual URL entry fallback
  const [externalUrl, setExternalUrl] = useState('');
  const [useManualUrl, setUseManualUrl] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      // Size check (max 10MB)
      if (selected.size > 10 * 1024 * 1024) {
        setError('Image must be under 10MB.');
        return;
      }
      if (!selected.type.startsWith('image/')) {
        setError('File must be an image format (JPG, PNG, WebP).');
        return;
      }
      setFile(selected);
      setTitle(selected.name.replace(/\.[^/.]+$/, ''));
      setAltText(selected.name.replace(/\.[^/.]+$/, ''));
      const objUrl = URL.createObjectURL(selected);
      setPreviewUrl(objUrl);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (useManualUrl) {
      if (!externalUrl.trim()) {
        setError('Please enter a valid image URL.');
        return;
      }
      setUploading(true);
      try {
        await saveMediaItem({
          title: title.trim() || 'Website Asset',
          altText: altText.trim() || title.trim(),
          url: externalUrl.trim(),
          sizeBytes: 0,
          mimeType: 'image/jpeg',
          category,
          createdAt: new Date().toISOString(),
          createdBy: 'admin',
        });
        onUploadSuccess(externalUrl.trim(), title.trim() || 'Website Asset');
        setSuccess(true);
        setExternalUrl('');
        setTitle('');
        setAltText('');
      } catch (err: any) {
        setError(err?.message || 'Failed to save media metadata.');
      } finally {
        setUploading(false);
      }
      return;
    }

    if (!file) {
      setError('Please select an image file to upload.');
      return;
    }

    setUploading(true);
    try {
      const timestamp = Date.now();
      const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const storagePath = `media/${timestamp}_${cleanName}`;
      const fileRef = ref(storage, storagePath);

      await uploadBytes(fileRef, file, { contentType: file.type });
      const downloadUrl = await getDownloadURL(fileRef);

      await saveMediaItem({
        title: title.trim() || file.name,
        altText: altText.trim() || file.name,
        url: downloadUrl,
        storagePath,
        sizeBytes: file.size,
        mimeType: file.type,
        category,
        createdAt: new Date().toISOString(),
        createdBy: 'admin',
      });

      onUploadSuccess(downloadUrl, title.trim() || file.name);
      setSuccess(true);
      setFile(null);
      setPreviewUrl(null);
      setTitle('');
      setAltText('');
    } catch (err: any) {
      console.warn('Upload fallback to direct media saving:', err);
      // If Storage rule/bucket requires direct URL saving:
      if (previewUrl) {
        setError(
          'Firebase Storage upload error: ' + (err?.message || 'Check storage permissions') + '. You can also switch to "Add via Image URL".'
        );
      } else {
        setError(err?.message || 'Upload failed.');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2">
          <ImageIcon className="w-5 h-5 text-[#b88528]" />
          <h4 className="text-sm font-bold text-[#10283F]">Add Asset to Media Library</h4>
        </div>
        <button
          type="button"
          onClick={() => setUseManualUrl(!useManualUrl)}
          className="text-xs text-[#b88528] hover:underline"
        >
          {useManualUrl ? '← Upload File Directly' : 'Or Add via Image URL'}
        </button>
      </div>

      {error && (
        <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 rounded flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Asset registered successfully in Media Library.</span>
        </div>
      )}

      <form onSubmit={handleUpload} className="space-y-4">
        {useManualUrl ? (
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Image Web URL (HTTPS)
            </label>
            <input
              type="url"
              required
              value={externalUrl}
              onChange={(e) => {
                setExternalUrl(e.target.value);
                setPreviewUrl(e.target.value);
              }}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-[#b88528]"
            />
          </div>
        ) : (
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Select Image File (JPG, PNG, WebP &lt; 10MB)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#10283F] file:text-white hover:file:bg-[#173859] cursor-pointer"
            />
          </div>
        )}

        {previewUrl && (
          <div className="relative w-32 h-24 rounded border border-slate-300 overflow-hidden bg-slate-100">
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Asset Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Bole Addis Office"
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-[#b88528]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Alt Text</label>
            <input
              type="text"
              required
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Descriptive alt text"
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-[#b88528]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-[#b88528]"
            >
              <option value="Consulting">Consulting</option>
              <option value="Executive">Executive</option>
              <option value="Offices">Offices</option>
              <option value="Industries">Industries</option>
              <option value="Articles">Articles</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded transition-all shadow flex items-center disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
              Processing Asset...
            </>
          ) : (
            <>
              <Upload className="w-3.5 h-3.5 mr-2 text-[#D5A13A]" />
              Upload & Register
            </>
          )}
        </button>
      </form>
    </div>
  );
};
