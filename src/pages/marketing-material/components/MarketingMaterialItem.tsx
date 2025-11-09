import { msg } from "@/lib/msg";
import { MarketingMaterialService } from "@/services/MarketingMaterialService";
import { LuImage, LuTrash2 } from "react-icons/lu";

export default function MarketingMaterialItem({ material, onDelete }: {
    material: {
        id: number,
        media_path: string,
        media_name: string,
        created_at: string
    },
    onDelete: () => void
}) {

    const handleDeleteMaterial = () => {
        msg.confirm('Delete ' + material.media_name, 'Action will permanantly delete file ' + material.media_name, {
            onConfirm: async () => {
                var r = await MarketingMaterialService.delete(material.id);
                if (r.success) {
                    msg.success('File deleted');
                    onDelete();
                }
                return r.success;
            }
        })
    };



    return (
        <div className="bg-white rounded-lg shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="relative aspect-video bg-gray-100 flex items-center justify-center">
                <img
                    src={material.media_path}
                    alt={material.media_name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                        (e.target as HTMLImageElement).onerror = null;
                        (e.target as HTMLImageElement).src = `https://placehold.co/400x300/ef4444/ffffff?text=Image+Load+Error`;
                    }}
                />

                <div className="absolute top-2 right-2 p-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium flex items-center space-x-1">
                    <LuImage className="w-3 h-3" />
                    <span>{material.media_name.toUpperCase()}</span>
                </div>

                {/* Delete Button calls the mock function */}
                <button
                    onClick={() => handleDeleteMaterial()}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-red-600/70 text-white hover:bg-red-700/80"
                    title={`Delete ${material.media_name}`}
                >
                    <LuTrash2 className="w-8 h-8" />
                </button>
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-800 truncate">{material.media_name}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                    Uploaded: {new Date(material.created_at).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
}