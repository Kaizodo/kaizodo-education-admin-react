import { useState } from "react";
import toast, { ToastOptions } from "react-hot-toast";
import { LuLoader } from "react-icons/lu";

export class msg {

  public static promise = toast.promise;

  public static async dismiss(id: string = '') {
    return toast.dismiss(id);
  }

  public static async loading(message: string = '', options?: ToastOptions) {
    return toast.custom((t) => (
      <div
        className={`flex items-center gap-2 p-3 rounded-lg shadow bg-white ${t.visible ? 'animate-enter' : 'animate-leave'
          }`}
      >
        <LuLoader className="w-5 h-5 animate-spin text-primary" />
        {message && <span className="text-sm">{message}</span>}
      </div>
    ), options);
  }

  public static async success(message: string, options?: ToastOptions) {
    return toast.success(message, options);
  }

  public static async warning(message: string, options?: ToastOptions) {
    return toast.error(message, options);
  }

  public static async error(message: string, options?: ToastOptions) {
    return toast.error(message, options);
  }

  public static async confirm(
    title: string,
    message: string,
    options?: {
      onConfirm?: () => void | Promise<void | boolean>;
      onCancel?: () => void;
      confirmText?: string;
      cancelText?: string;
    }
  ) {
    return toast((t) => {
      const [loading, setLoading] = useState(false);
      return (
        <div className="p-2 flex flex-col w-80">
          <span className="text-lg font-semibold mb-2">{title}</span>
          <p className="text-sm mb-4">{message}</p>
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-gray-800"
              onClick={() => {
                options?.onCancel?.();
                toast.dismiss(t.id);
              }}
            >
              {options?.cancelText || "Cancel"}
            </button>
            <button
              disabled={loading}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white relative overflow-hidden"
              onClick={async () => {
                setLoading(true);
                const promise = options?.onConfirm?.();
                if (promise instanceof Promise) {
                  var result = await promise;
                  if (typeof result === 'boolean') {
                    if (!result) {
                      setLoading(false);
                      return;
                    }
                  }
                }
                setLoading(false);
                toast.dismiss(t.id);
              }}
            >
              {!!loading && <div className="absolute w-full h-full flex items-center justify-center z-10 bg-inherit opacity-90 text-white text-inherit top-0 left-0"><LuLoader className="animate-spin" /></div>}
              {options?.confirmText || "Yes"}
            </button>
          </div>
        </div>
      )
    });
  }
}
