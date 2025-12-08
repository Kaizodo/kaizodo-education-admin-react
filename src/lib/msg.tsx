import { useEffect, useState } from "react";
import toast, { ToastOptions } from "react-hot-toast";
import { LuLoader } from "react-icons/lu";
import { createPortal } from "react-dom";


function Overlay({ t, resolve }: any) {
  const [show, setShow] = useState(true);
  if (!show) {
    return null;
  }
  return <div className="fixed inset-0 bg-black/50 z-[9998]" onClick={() => {
    resolve();
    toast.dismiss(t.id);
    setShow(false)
  }}></div>
}

function ConfirmToast({ t, title, message, options, resolve }: any) {
  const [loading, setLoading] = useState(false);
  const [resolved, setResolved] = useState(false);
  useEffect(() => {
    return () => resolve();
  }, []);


  return (
    <>
      {!resolved && createPortal(<Overlay t={t} resolve={resolve} />, document.body)}

      {/* POPUP */}
      <div className="p-2 flex flex-col w-80 relative z-[9999] ">
        <span className="text-lg font-semibold mb-2">{title}</span>
        <p className="text-sm mb-4">{message}</p>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={() => {
              options?.onCancel?.();
              toast.dismiss(t.id);
              resolve();
              setResolved(true);
            }}
          >
            {options?.cancelText || "Cancel"}
          </button>

          <button
            disabled={loading}
            className="px-4 py-2 bg-blue-600 rounded text-white relative"
            onClick={async () => {
              setLoading(true);

              const result = await options?.onConfirm?.();
              if (result === false) {
                setLoading(false);
                return;
              }
              setResolved(true);
              toast.dismiss(t.id);
              resolve();
            }}
          >
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <LuLoader className="animate-spin" />
              </div>
            )}
            {options?.confirmText || "Yes"}
          </button>
        </div>
      </div>
    </>
  );
}


export class msg {

  public static promise = toast.promise;

  public static async dismiss(id: string = '') {
    return toast.dismiss(id);
  }

  public static loading(message: string = '', options?: ToastOptions) {
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
    return new Promise<void>((resolve) => {
      toast((t) => {
        return <ConfirmToast
          t={t}
          title={title}
          message={message}
          options={options}
          resolve={resolve}
        />
      }, {
        duration: Infinity,
        removeDelay: 0
      })
    });
  }
}
