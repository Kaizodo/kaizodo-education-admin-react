import { Button } from "@/components/ui/button";
import { Package, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingSelectionBar({ count, onProcess, onClear }) {
    return (
        <AnimatePresence>
            {count > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
                >
                    <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center">
                                <Package className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Selected Items</p>
                                <p className="text-xl font-bold">{count}</p>
                            </div>
                        </div>
                        <div className="h-10 w-px bg-slate-700" />
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={onClear}
                                variant="ghost"
                                size="sm"
                                className="text-slate-400 hover:text-white hover:bg-slate-800"
                            >
                                <X className="w-4 h-4 mr-1" />
                                Clear
                            </Button>
                            <Button
                                onClick={onProcess}
                                className="bg-indigo-500 hover:bg-indigo-600 text-white px-6"
                            >
                                Process
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}