import { Modal, ModalBody, ModalFooter } from "@/components/common/Modal"
import { useEffect, useRef, useState } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import './use-cropper/style.css'
import Btn from "@/components/common/Btn";
import { base64ToObjectURL } from "@/lib/utils";

export type CropperConfig = {
    format?: 'blob' | 'base64' | 'objectUrl' | 'file',
    aspectRatio?: number,
}

export type CropperExportType = string | Blob | File | null;


export const openCropper = async (url: string, { aspectRatio, format = 'objectUrl' }: CropperConfig): Promise<CropperExportType> => {
    return new Promise((resolve) => {
        const modal_id = Modal.show({
            title: 'Crop Image',
            maxWidth: '80%',
            onClose: () => {
                resolve(null);
            },
            content: () => {
                const [cropping, setCropping] = useState(false);
                const [ratio, setRatio] = useState<number | undefined>(aspectRatio);
                const cropperRef = useRef<ReactCropperElement>(null);
                const onCrop = () => {
                    setCropping(true);
                    setTimeout(() => {
                        if (cropperRef.current) {
                            const cropper = cropperRef.current?.cropper;

                            var output: CropperExportType = null
                            if (['base64', 'objectUrl'].includes(format)) {
                                output = cropper.getCroppedCanvas().toDataURL();
                                if (format == 'objectUrl') {
                                    output = base64ToObjectURL(cropper.getCroppedCanvas().toDataURL());
                                }
                            } else if (['file', 'blob'].includes(format)) {
                                cropper.getCroppedCanvas().toBlob((blob) => {
                                    if (blob) {
                                        if (format == 'blob') {
                                            resolve(blob);
                                            Modal.close(modal_id);
                                        } else {
                                            resolve(new File([blob], url.split('/').pop() || 'cropped-image.png', { type: 'image/png' }))
                                            Modal.close(modal_id);
                                        }
                                    } else {
                                        resolve(null);
                                        Modal.close(modal_id);
                                    }
                                });
                                return;
                            }
                            resolve(output);
                            Modal.close(modal_id);
                        }
                    }, 500);


                };

                useEffect(() => {
                    if (cropperRef.current && ratio !== undefined) {
                        const cropper = cropperRef.current?.cropper;
                        cropper.setAspectRatio(ratio);
                    }
                }, [ratio]);

                return <>
                    <ModalBody>
                        <div className="flex flex-row">
                            {!aspectRatio && <div className="me-auto flex flex-row gap-2">
                                <Btn onClick={() => setRatio(NaN)}>Free Mode</Btn>
                                <Btn onClick={() => setRatio(1)}>1:1</Btn>
                                <Btn onClick={() => setRatio(16 / 9)}>16:9</Btn>
                                <Btn onClick={() => setRatio(9 / 16)}>9:16</Btn>
                            </div>}
                        </div>
                        <Cropper
                            dragMode="move"
                            background={false}
                            viewMode={1}
                            src={url}
                            crossOrigin="anonymous"
                            checkCrossOrigin
                            style={{ height: 300, width: "100%" }}
                            initialAspectRatio={ratio}
                            guides={true}
                            ref={cropperRef}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Btn onClick={onCrop} loading={cropping} >Done</Btn>
                    </ModalFooter>
                </>;
            }
        })
    })
}

export function useCropper() {

    const openCropperUrl = async (imageUrl: string, config?: CropperConfig): Promise<CropperExportType> => {
        return openCropper(imageUrl, { ...config });
    }


    const openCropperFile = (file: File, config?: CropperConfig): Promise<CropperExportType> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = async () => {
                if (typeof reader.result === 'string') {
                    var croppedFile = await openCropper(reader.result, { ...config });
                    if (croppedFile instanceof File) {
                        return resolve(new File(
                            [croppedFile],
                            file.name,
                            {
                                type: file.type,
                                lastModified: file.lastModified
                            }
                        ));
                    }
                    return resolve(croppedFile);
                } else {
                    resolve(null);
                }
            };
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(file);
        });
    }





    return {
        openCropperUrl,
        openCropperFile
    };
}