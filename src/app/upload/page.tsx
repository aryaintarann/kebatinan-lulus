"use client";

import { useState } from "react";
import { slugify } from "@/lib/utils";

const EMPLOYEES = [
    "Arya Ngurah Intaran",
    "Nama Lengkap 2",
    "Nama Lengkap 3",
    "Nama Lengkap 4",
    "Nama Lengkap 5",
    "Nama Lengkap 6",
    "Nama Lengkap 7",
    "Nama Lengkap 8",
    "Nama Lengkap 9",
]; // TODO: Import this from a shared source or keep synced

export default function UploadPage() {
    const [selectedName, setSelectedName] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState("");
    const [status, setStatus] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0];
            setFile(f);
            setPreview(URL.createObjectURL(f));
        }
    };

    const handleUpload = async () => {
        if (!file || !selectedName) {
            setStatus("Please select a name and a file.");
            return;
        }

        setUploading(true);
        setStatus("Uploading...");

        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const preset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;

        if (!cloudName || !preset) {
            setStatus("Missing configuration.");
            setUploading(false);
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", preset);
        formData.append("public_id", `graduates/${slugify(selectedName)}`); // Explicit public ID for predictable URL

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();

            if (data.secure_url) {
                setStatus("Upload successful! Refresh the main page to see changes.");
                setPreview(data.secure_url);
            } else {
                setStatus("Upload failed: " + (data.error?.message || "Unknown error"));
            }
        } catch (error) {
            setStatus("Upload error.");
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center font-mono">
            <div className="max-w-md w-full space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10">
                <h1 className="text-2xl font-bold text-center mb-8">Upload Foto Wisuda</h1>

                <div className="space-y-2">
                    <label className="block text-sm text-gray-400">Pilih Nama</label>
                    <select
                        value={selectedName}
                        onChange={(e) => setSelectedName(e.target.value)}
                        className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg focus:outline-none focus:border-yellow-500"
                    >
                        <option value="">-- Pilih Nama --</option>
                        {EMPLOYEES.map((name) => (
                            <option key={name} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm text-gray-400">Pilih Foto</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full text-sm text-gray-400
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-yellow-600/20 file:text-yellow-500
                            hover:file:bg-yellow-600/30
                        "
                    />
                </div>

                {preview && (
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-white/20">
                        <img src={preview} alt="Preview" className="object-cover w-full h-full" />
                    </div>
                )}

                <button
                    onClick={handleUpload}
                    disabled={uploading || !selectedName || !file}
                    className={`w-full py-4 rounded-lg font-bold tracking-widest uppercase transition-all
                        ${uploading
                            ? "bg-gray-600 cursor-not-allowed"
                            : "bg-white text-black hover:bg-gray-200"
                        }`}
                >
                    {uploading ? "Uploading..." : "Upload Photo"}
                </button>

                {status && (
                    <p className={`text-center text-sm ${status.includes("success") ? "text-green-400" : "text-red-400"}`}>
                        {status}
                    </p>
                )}
            </div>
        </div>
    );
}
