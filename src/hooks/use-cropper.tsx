import { Modal, ModalBody, ModalFooter } from "@/components/common/Modal"
import { useEffect, useRef, useState } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import './use-cropper/style.css'
import Btn from "@/components/common/Btn";
import { base64ToObjectURL } from "@/lib/utils";
import { AiOutlineRotateLeft, AiOutlineRotateRight } from "react-icons/ai";

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

                const fullImage = () => {
                    const c = cropperRef.current?.cropper;
                    if (!c) return;

                    const img = c.getImageData();

                    c.setData({
                        x: 0,
                        y: 0,
                        width: img.naturalWidth,
                        height: img.naturalHeight
                    });
                };


                const rotateLeft = () => {
                    cropperRef.current?.cropper.rotate(-90);
                };

                const rotateRight = () => {
                    cropperRef.current?.cropper.rotate(90);
                };

                const onCrop = () => {
                    setCropping(true);
                    setTimeout(() => {
                        if (cropperRef.current) {
                            const cropper = cropperRef.current.cropper;

                            var output: CropperExportType = null;

                            if (['base64', 'objectUrl'].includes(format)) {
                                output = cropper.getCroppedCanvas().toDataURL();
                                if (format === 'objectUrl') {
                                    output = base64ToObjectURL(output);
                                }
                                resolve(output);
                                Modal.close(modal_id);
                                return;
                            }

                            if (['file', 'blob'].includes(format)) {
                                cropper.getCroppedCanvas().toBlob((blob) => {
                                    if (blob) {
                                        if (format === 'blob') {
                                            resolve(blob);
                                        } else {
                                            resolve(new File([blob], url.split('/').pop() || 'cropped-image.png', { type: 'image/png' }));
                                        }
                                    } else resolve(null);
                                    Modal.close(modal_id);
                                });
                            }
                        }
                    }, 500);
                };

                useEffect(() => {
                    if (cropperRef.current && ratio !== undefined) {
                        cropperRef.current.cropper.setAspectRatio(ratio);
                    }
                }, [ratio]);

                return (
                    <>
                        <ModalBody>
                            <div className="flex flex-row gap-2 mb-2">
                                {!aspectRatio && (
                                    <>
                                        <Btn variant={'outline'} size={'xs'} onClick={() => setRatio(NaN)}>Free</Btn>
                                        <Btn variant={'outline'} size={'xs'} onClick={() => setRatio(1)}>1:1</Btn>
                                        <Btn variant={'outline'} size={'xs'} onClick={() => setRatio(16 / 9)}>16:9</Btn>
                                        <Btn variant={'outline'} size={'xs'} onClick={() => setRatio(9 / 16)}>9:16</Btn>
                                    </>
                                )}

                                <Btn variant={'outline'} size={'xs'} onClick={fullImage}>Full Image</Btn>
                                <Btn variant={'outline'} size={'xs'} onClick={rotateLeft}><AiOutlineRotateLeft /></Btn>
                                <Btn variant={'outline'} size={'xs'} onClick={rotateRight}><AiOutlineRotateRight /></Btn>
                            </div>

                            <Cropper
                                dragMode="move"
                                background={false}
                                viewMode={1}
                                src={url}
                                crossOrigin="anonymous"
                                checkCrossOrigin
                                style={{
                                    width: "100%",
                                    height: window.innerHeight - 100,
                                    maxHeight: window.innerHeight - 100,
                                    overflow: "hidden"
                                }}
                                initialAspectRatio={ratio}
                                guides={true}
                                ref={cropperRef}
                            />
                        </ModalBody>

                        <ModalFooter>
                            <Btn onClick={onCrop} loading={cropping}>Done</Btn>
                        </ModalFooter>
                    </>
                );
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