import { FaFacebook, FaGoogle, FaInstagram } from "react-icons/fa6";
import Btn from "../Btn";
import { Modal, ModalBody, ModalFooter } from "../Modal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useSetValue } from "@/hooks/use-set-value";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, Search, Share2, Wand2 } from "lucide-react";
import TextField from "../TextField";
import FileField from "../FileField";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SeoService } from "@/services/SeoService";
import { msg } from "@/lib/msg";
import { getImageObjectUrl } from "@/lib/utils";
import { useCropper } from "@/hooks/use-cropper";
import { Seo } from "@/data/Seo";

type Props = {
    id?: number;
    type: Seo;
    title?: string;
    description?: string;
    image?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
};

export default function SeoManager({ id, type, title, description, image, onSuccess, onCancel }: Props) {
    const [seoScore, setSeoScore] = useState(0);
    const { openCropperFile } = useCropper();
    const [form, setForm] = useState<any>({
        id: null,
        record_id: id,
        record_type: type,
        title: title || "",
        description: description || "",
        keywords: "",
        ogImage: image || "",
        twitterImage: image || "",
        image_file: null,
        twitter_image_file: null,
        meta: [],
    });
    const setValue = useSetValue(setForm);

    const get = async (record_id: number, record_type: number) => {
        const res = await SeoService.detail(record_id, record_type);
        if (res.success) {
            const data = res.data;
            setForm({
                id: data.id,
                record_id: data.record_id,
                record_type: data.record_type,
                title: data.title || "",
                description: data.description || "",
                keywords: data.keywords || "",
                meta: data.meta || [],
                ogImage: data.meta.find((m: any) => m.tag_name === "og:image")?.tag_content || image || "",
                twitterImage: data.meta.find((m: any) => m.tag_name === "twitter:image")?.tag_content || image || "",
                image_file: null,
                twitter_image_file: null,
            });
        } else {
            setForm({
                id: null,
                record_id: id,
                record_type: type,
                title: title || "",
                description: description || "",
                keywords: "",
                ogImage: image || "",
                twitterImage: image || "",
                image_file: null,
                twitter_image_file: null,
                meta: [],
            });
        }
    };

    useEffect(() => {
        if (id && type) {
            get(id, Number(type));
        }
    }, [id, type]);

    const autoFillSEO = () => {
        setForm((prev: any) => ({
            ...prev,
            ogTitle: prev.title || prev.ogTitle,
            ogDescription: prev.description || prev.ogDescription,
            ogImage: prev.ogImage || image,
            twitterTitle: prev.title || prev.twitterTitle,
            twitterDescription: prev.description || prev.twitterDescription,
            twitterImage: prev.twitterImage || image,
            canonicalUrl: `https://yourblog.com/${prev.record_type}/${prev.record_id}`,
            meta: [
                { tag_name: "og:title", tag_content: prev.title, property: "og:title" },
                { tag_name: "og:description", tag_content: prev.description, property: "og:description" },
                { tag_name: "og:image", tag_content: prev.ogImage || image, property: "og:image" },
                { tag_name: "twitter:title", tag_content: prev.title, property: null },
                { tag_name: "twitter:description", tag_content: prev.description, property: null },
                { tag_name: "twitter:image", tag_content: prev.twitterImage || image, property: null },
                { tag_name: "twitter:card", tag_content: "summary_large_image", property: null },
                { tag_name: "robots", tag_content: "index, follow", property: null },
            ].filter((meta) => meta.tag_content),
        }));
    };

    const getSEOScoreColor = () => {
        if (seoScore >= 80) return "text-green-600";
        if (seoScore >= 60) return "text-yellow-600";
        return "text-red-600";
    };

    const getSEOScoreText = () => {
        if (seoScore >= 80) return "Excellent";
        if (seoScore >= 60) return "Good";
        if (seoScore >= 40) return "Needs Improvement";
        return "Poor";
    };

    useEffect(() => {
        let score = 0;
        if (form.title && form.title.length >= 30 && form.title.length <= 60) score += 15;
        if (form.description && form.description.length >= 120 && form.description.length <= 155) score += 15;
        if (form.keywords && form.keywords.split(",").length >= 3) score += 10;
        if (form.meta.some((m: any) => m.tag_name === "og:title" && m.tag_content)) score += 5;
        if (form.meta.some((m: any) => m.tag_name === "og:description" && m.tag_content)) score += 5;
        if (form.meta.some((m: any) => m.tag_name === "twitter:title" && m.tag_content)) score += 5;
        if (form.meta.some((m: any) => m.tag_name === "twitter:description" && m.tag_content)) score += 5;
        setSeoScore(score);
    }, [form]);

    const handleSave = async () => {
        const payload = new FormData();
        if (form.id) payload.append("id", form.id);
        payload.append("record_id", form.record_id);
        payload.append("record_type", form.record_type);
        payload.append("title", form.title);
        payload.append("description", form.description || "");
        payload.append("keywords", form.keywords || "");
        if (form.image_file) payload.append("og_image", form.image_file);
        if (form.twitter_image_file) payload.append("twitter_image", form.twitter_image_file);
        payload.append("meta", JSON.stringify(form.meta));

        const res = form.id ? await SeoService.update(payload) : await SeoService.create(payload);

        if (res.success) {
            msg.success(form.id ? "SEO updated successfully" : "SEO created successfully");
            onSuccess?.();
        }
    };

    return (
        <>
            <ModalBody>
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Search className="h-5 w-5" />
                                <CardTitle className="text-lg">SEO Score</CardTitle>
                            </div>
                            <div className={`text-2xl font-bold ${getSEOScoreColor()}`}>{seoScore}/100</div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Optimization Level</span>
                                <span className={getSEOScoreColor()}>{getSEOScoreText()}</span>
                            </div>
                            <Progress value={seoScore} className="h-2" />
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Tabs defaultValue="seo" className="space-y-6">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="seo" className="flex items-center gap-2">
                                    <Search className="h-4 w-4" />
                                    SEO
                                </TabsTrigger>
                                <TabsTrigger value="social" className="flex items-center gap-2">
                                    <Share2 className="h-4 w-4" />
                                    Social
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="seo" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle>Search Engine Optimization</CardTitle>
                                                <CardDescription>Optimize your post for search engines</CardDescription>
                                            </div>
                                            <Btn variant="outline" onClick={autoFillSEO} className="flex items-center gap-2">
                                                <Wand2 className="h-4 w-4" />
                                                Auto-fill SEO
                                            </Btn>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <TextField
                                            value={form.title}
                                            onChange={setValue("title")}
                                            placeholder="SEO-optimized title"
                                        >
                                            Meta Title
                                        </TextField>
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>Recommended: 50-60 characters</span>
                                            {!!form.title && (
                                                <span
                                                    className={
                                                        form.title.length >= 50 && form.title.length <= 60
                                                            ? "text-green-600"
                                                            : ""
                                                    }
                                                >
                                                    {form.title.length}/60
                                                </span>
                                            )}
                                        </div>

                                        <TextField
                                            value={form.description}
                                            onChange={setValue("description")}
                                            placeholder="Compelling description for search results"
                                            multiline
                                        >
                                            Meta Description
                                        </TextField>
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>Recommended: 120-155 characters</span>
                                            {!!form.description && (
                                                <span
                                                    className={
                                                        form.description.length >= 120 &&
                                                            form.description.length <= 155
                                                            ? "text-green-600"
                                                            : ""
                                                    }
                                                >
                                                    {form.description.length}/155
                                                </span>
                                            )}
                                        </div>

                                        <TextField
                                            value={form.keywords}
                                            onChange={setValue("keywords")}
                                            placeholder="keyword1, keyword2, keyword3"
                                            multiline
                                        >
                                            Focus Keywords
                                        </TextField>
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <p>Separate keywords with commas. Auto-populated from tags.</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="social" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Open Graph (Facebook, LinkedIn)</CardTitle>
                                        <CardDescription>How your post appears when shared on social media</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <TextField
                                            value={form.meta.find((m: any) => m.tag_name === "og:title")?.tag_content || ""}
                                            onChange={(value) =>
                                                setForm((prev: any) => ({
                                                    ...prev,
                                                    meta: [
                                                        ...prev.meta.filter((m: any) => m.tag_name !== "og:title"),
                                                        { tag_name: "og:title", tag_content: value, property: "og:title" },
                                                    ],
                                                }))
                                            }
                                            placeholder="Social media title"
                                        >
                                            OG Title
                                        </TextField>
                                        <TextField
                                            value={
                                                form.meta.find((m: any) => m.tag_name === "og:description")?.tag_content ||
                                                ""
                                            }
                                            onChange={(value) =>
                                                setForm((prev: any) => ({
                                                    ...prev,
                                                    meta: [
                                                        ...prev.meta.filter((m: any) => m.tag_name !== "og:description"),
                                                        {
                                                            tag_name: "og:description",
                                                            tag_content: value,
                                                            property: "og:description",
                                                        },
                                                    ],
                                                }))
                                            }
                                            multiline
                                            placeholder="Social media description"
                                        >
                                            OG Description
                                        </TextField>
                                        <div className="space-y-2">
                                            <FileField
                                                accept="image/*"
                                                onChange={async (files) => {
                                                    if (files.length > 0) {
                                                        const file = await openCropperFile(files[0], {
                                                            aspectRatio: 3 / 2,
                                                            format: "file",
                                                        });
                                                        if (file instanceof File) {
                                                            const imageUrl = await getImageObjectUrl(file);
                                                            setForm((prev: any) => ({
                                                                ...prev,
                                                                image_file: file,
                                                                ogImage: imageUrl,
                                                                meta: [
                                                                    ...prev.meta.filter((m: any) => m.tag_name !== "og:image"),
                                                                    {
                                                                        tag_name: "og:image",
                                                                        tag_content: imageUrl,
                                                                        property: "og:image",
                                                                    },
                                                                ],
                                                            }));
                                                        }
                                                    }
                                                }}
                                            >
                                                Open Graph Image
                                            </FileField>
                                            <p className="text-xs text-muted-foreground">Recommended: 1200x630px</p>
                                            {form.ogImage && (
                                                <img
                                                    src={form.ogImage}
                                                    alt="OG Image Preview"
                                                    className="mt-2 max-w-xs"
                                                />
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>X (Twitter) Card</CardTitle>
                                        <CardDescription>Optimize for Twitter/X sharing</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <TextField
                                            value={
                                                form.meta.find((m: any) => m.tag_name === "twitter:title")?.tag_content ||
                                                ""
                                            }
                                            onChange={(value) =>
                                                setForm((prev: any) => ({
                                                    ...prev,
                                                    meta: [
                                                        ...prev.meta.filter((m: any) => m.tag_name !== "twitter:title"),
                                                        { tag_name: "twitter:title", tag_content: value, property: null },
                                                    ],
                                                }))
                                            }
                                            placeholder="X title"
                                        >
                                            X Title
                                        </TextField>
                                        <TextField
                                            value={
                                                form.meta.find((m: any) => m.tag_name === "twitter:description")
                                                    ?.tag_content || ""
                                            }
                                            onChange={(value) =>
                                                setForm((prev: any) => ({
                                                    ...prev,
                                                    meta: [
                                                        ...prev.meta.filter(
                                                            (m: any) => m.tag_name !== "twitter:description"
                                                        ),
                                                        {
                                                            tag_name: "twitter:description",
                                                            tag_content: value,
                                                            property: null,
                                                        },
                                                    ],
                                                }))
                                            }
                                            multiline
                                            placeholder="X description"
                                        >
                                            X Description
                                        </TextField>
                                        <div className="space-y-2">
                                            <FileField
                                                accept="image/*"
                                                onChange={async (files) => {
                                                    if (files.length > 0) {
                                                        const file = await openCropperFile(files[0], {
                                                            aspectRatio: 3 / 2,
                                                            format: "file",
                                                        });
                                                        if (file instanceof File) {
                                                            const imageUrl = await getImageObjectUrl(file);
                                                            setForm((prev: any) => ({
                                                                ...prev,
                                                                twitter_image_file: file,
                                                                twitterImage: imageUrl,
                                                                meta: [
                                                                    ...prev.meta.filter(
                                                                        (m: any) => m.tag_name !== "twitter:image"
                                                                    ),
                                                                    {
                                                                        tag_name: "twitter:image",
                                                                        tag_content: imageUrl,
                                                                        property: null,
                                                                    },
                                                                ],
                                                            }));
                                                        }
                                                    }
                                                }}
                                            >
                                                Twitter Image
                                            </FileField>
                                            <p className="text-xs text-muted-foreground">Recommended: 1200x630px</p>
                                            {form.twitterImage && (
                                                <img
                                                    src={form.twitterImage}
                                                    alt="Twitter Image Preview"
                                                    className="mt-2 max-w-xs"
                                                />
                                            )}
                                        </div>
                                        <TextField
                                            value={
                                                form.meta.find((m: any) => m.tag_name === "twitter:card")?.tag_content || ""
                                            }
                                            onChange={(value) =>
                                                setForm((prev: any) => ({
                                                    ...prev,
                                                    meta: [
                                                        ...prev.meta.filter((m: any) => m.tag_name !== "twitter:card"),
                                                        { tag_name: "twitter:card", tag_content: value, property: null },
                                                    ],
                                                }))
                                            }
                                            placeholder="summary_large_image"
                                        >
                                            Twitter Card Type
                                        </TextField>
                                        <TextField
                                            value={
                                                form.meta.find((m: any) => m.tag_name === "twitter:site")?.tag_content || ""
                                            }
                                            onChange={(value) =>
                                                setForm((prev: any) => ({
                                                    ...prev,
                                                    meta: [
                                                        ...prev.meta.filter((m: any) => m.tag_name !== "twitter:site"),
                                                        { tag_name: "twitter:site", tag_content: value, property: null },
                                                    ],
                                                }))
                                            }
                                            placeholder="@yourhandle"
                                        >
                                            Twitter Handle
                                        </TextField>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Advanced Meta</CardTitle>
                                        <CardDescription>Extra control for indexing and sharing behavior</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="robots">Robots Meta Tag</Label>
                                            <Input
                                                id="robots"
                                                placeholder="index, follow"
                                                value={
                                                    form.meta.find((m: any) => m.tag_name === "robots")?.tag_content || ""
                                                }
                                                onChange={(e) =>
                                                    setForm((prev: any) => ({
                                                        ...prev,
                                                        meta: [
                                                            ...prev.meta.filter((m: any) => m.tag_name !== "robots"),
                                                            { tag_name: "robots", tag_content: e.target.value, property: null },
                                                        ],
                                                    }))
                                                }
                                            />
                                            <p className="text-xs text-muted-foreground">Control search engine indexing</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="schema">Structured Data (JSON-LD)</Label>
                                            <Textarea
                                                id="schema"
                                                placeholder='{"@context": "https://schema.org", "@type": "Article", "headline": "Example"}'
                                                value={
                                                    form.meta.find((m: any) => m.tag_name === "schema")?.tag_content || ""
                                                }
                                                onChange={(e) =>
                                                    setForm((prev: any) => ({
                                                        ...prev,
                                                        meta: [
                                                            ...prev.meta.filter((m: any) => m.tag_name !== "schema"),
                                                            { tag_name: "schema", tag_content: e.target.value, property: null },
                                                        ],
                                                    }))
                                                }
                                                className="font-mono text-xs"
                                                rows={5}
                                            />
                                            <p className="text-xs text-muted-foreground">Paste valid JSON-LD schema markup</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">SEO Checklist</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2">
                                    {!form.title || (form.title.length >= 30 && form.title.length <= 60) ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <AlertCircle className="h-4 w-4 text-red-600" />
                                    )}
                                    <span className="text-sm">Title length (30-60 chars)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!form.description ||
                                        (form.description.length >= 120 && form.description.length <= 155) ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <AlertCircle className="h-4 w-4 text-red-600" />
                                    )}
                                    <span className="text-sm">Meta description length</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!form.keywords || form.keywords.split(",").length >= 3 ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <AlertCircle className="h-4 w-4 text-red-600" />
                                    )}
                                    <span className="text-sm">Focus keywords (3+)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {form.meta.some((m: any) => m.tag_name === "og:title" && m.tag_content) &&
                                        form.meta.some((m: any) => m.tag_name === "og:description" && m.tag_content) ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <AlertCircle className="h-4 w-4 text-red-600" />
                                    )}
                                    <span className="text-sm">Social media optimization</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Search Preview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="text-blue-600 text-sm hover:underline cursor-pointer">
                                        {form.title || "Your Blog Title"}
                                    </div>
                                    <div className="text-green-700 text-xs">
                                        yourblog.com/{form.record_type}/{form.record_id || "your-slug"}
                                    </div>
                                    <div className="text-gray-600 text-sm">
                                        {form.description || "Your meta description will appear here..."}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Btn onClick={handleSave}>Save</Btn>
                <Btn variant="outline" onClick={onCancel}>
                    Cancel
                </Btn>
            </ModalFooter>
        </>
    );
}

export function openSeo(props: Props) {
    const modal_id = Modal.show({
        title: "Manage SEO",
        maxWidth: "1200px",
        content: <SeoManager {...props} onCancel={() => Modal.close(modal_id)} onSuccess={() => Modal.close(modal_id)} />,
    });
}

export function SeoBtn(props: Props) {
    return (
        <div>
            {!!props.id && (
                <Btn variant="outline" onClick={() => openSeo(props)}>
                    <FaGoogle />
                    <FaFacebook />
                    <FaInstagram />
                    SEO
                </Btn>
            )}
        </div>
    );
}