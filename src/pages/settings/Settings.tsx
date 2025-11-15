import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import AppPage from '@/components/app/AppPage';
import AppCard from '@/components/app/AppCard';
import Btn from '@/components/common/Btn';
import TextField from '@/components/common/TextField';
import CenterLoading from '@/components/common/CenterLoading';
import { SettingService } from '@/services/SettingService';
import { msg } from '@/lib/msg';
import { useEffect, useState } from 'react';
import { useForm } from '@/hooks/use-form';
import SuggestCountry from '@/components/common/suggest/SuggestCountry';
import SuggestState from '@/components/common/suggest/SuggestState';
import SuggestCity from '@/components/common/suggest/SuggestCity';
import SuggestDistrict from '@/components/common/suggest/SuggestDistrict';
import SuggestLocality from '@/components/common/suggest/SuggestLocality';
import Radio from '@/components/common/Radio';
import { YesNoArray } from '@/data/Common';

const SettingsManagement = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);


    const [form, setValue, setForm] = useForm();


    const load = async () => {
        setLoading(true);
        var r = await SettingService.getSettings();
        if (r.success) {
            setForm(r.data);
        }
        setLoading(false);
    }

    const save = async () => {
        setSaving(true);
        var r = await SettingService.setSettings(form);
        if (r.success) {
            msg.success('Settings saved');
        }
        setSaving(false);
    }



    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, key: string, preview_key: string) => {
        const file = event.target.files?.[0];
        if (file) {
            setValue(key)(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setValue(preview_key)(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };


    useEffect(() => {
        load();
    }, [])

    return (
        <AppPage title='Settings' subtitle='Manage school and system settings' actions={<div className='pe-6'><Btn onClick={save} loading={saving}>Save Settings</Btn></div>}>
            <AppCard

                contentClassName={'px-6 pb-6 pt-6 space-y-3 relative'}
            >
                {loading && <CenterLoading className='absolute' />}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField value={form.company_name} onChange={setValue('company_name')} placeholder="Company Name">Company Name</TextField>
                    <TextField value={form.tagline} onChange={setValue('tagline')} placeholder="Tagline">Tagline</TextField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className='grid grid-cols-2 col-span-2 gap-4'>
                        <div className="space-y-2">
                            <Label>
                                <span>Short Logo</span>
                                <div className="flex items-center gap-4 mt-2">
                                    {form.logo_short && (
                                        <img
                                            src={form.logo_short}
                                            alt="School Logo"
                                            className="w-10 h-10 object-contain border rounded-lg"
                                        />
                                    )}
                                    <div className='w-full border flex items-center rounded-sm p-3'>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(e, 'logo_short_file', 'logo_short')}
                                            className="hidden"
                                        />
                                        <Upload className="h-4 w-4 mr-2" />
                                        Upload Full Logo
                                    </div>
                                </div>
                            </Label>

                        </div>

                        <div className="space-y-2">
                            <Label>
                                <span>Full Logo</span>
                                <div className="flex items-center gap-4">
                                    {form.logo_full && (
                                        <img
                                            src={form.logo_full}
                                            alt="School Logo"
                                            className="min-w-10 min-h-10 object-contain border rounded-lg"
                                        />
                                    )}
                                    <div className='w-full border flex items-center rounded-sm p-3 mt-2'>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(e, 'logo_full_file', 'logo_full')}
                                            className="hidden"
                                        />
                                        <Upload className="h-4 w-4 mr-2" />
                                        Upload Full Logo
                                    </div>
                                </div>
                            </Label>

                        </div>
                    </div>
                </div>
                <strong className='flex'>Address Details (Billing Purposes)</strong>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6 mb-6">
                    <SuggestCountry value={form.country_id} onChange={setValue('country_id')} selected={{ id: form.country_id, name: form.country_name }} />
                    <SuggestState disabled={!form.country_id} country_id={form.country_id} value={form.state_id} onChange={setValue('state_id')} selected={{ id: form.state_id, name: form.state_name }} />
                    <SuggestCity disabled={!form.state_id} state_id={form.state_id} value={form.city_id} onChange={setValue('city_id')} selected={{ id: form.city_id, name: form.city_name }} />

                    <SuggestDistrict disabled={!form.city_id} value={form.district_id} onChange={setValue('district_id')} selected={{ id: form.district_id, name: form.district_name }} />
                    <SuggestLocality disabled={!form.state_id || !form.city_id} state_id={form.state_id} city_id={form.state_id} value={form.locality_id} onChange={setValue('locality_id')} selected={{ id: form.locality_id, name: form.locality_name }} />

                    <TextField value={form.pincode} onChange={setValue('pincode')} placeholder="Pincode">Pincode</TextField>
                    <TextField value={form.billing_address} onChange={setValue('billing_address')} multiline placeholder="Billing Address">Billing Address</TextField>
                </div>

                <strong className='flex'>Contact Details</strong>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6 mb-6">
                    <TextField value={form.phone} onChange={setValue('phone')} placeholder="Phone">Phone</TextField>
                    <TextField value={form.email} onChange={setValue('email')} placeholder="Email">Email</TextField>
                    <TextField value={form.website} onChange={setValue('website')} placeholder="Website">Website</TextField>
                </div>

                <strong className='flex'>Social Media</strong>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <TextField value={form.facebook_page_url} onChange={setValue('facebook_page_url')} placeholder="Facebook page url">Facebook page url</TextField>
                    <TextField value={form.x_page_url} onChange={setValue('x_page_url')} placeholder="Twitter (X) page url">Twitter (X) page url</TextField>
                    <TextField value={form.linkedin_page_url} onChange={setValue('linkedin_page_url')} placeholder="LinkedIn page url">LinkedIn page url</TextField>
                    <TextField value={form.instagram_page_url} onChange={setValue('instagram_page_url')} placeholder="Instagram page url">Instagram page url</TextField>
                    <TextField value={form.youtube_page_url} onChange={setValue('youtube_page_url')} placeholder="YouTube channel url">YouTube channel url</TextField>
                    <TextField value={form.facebook_handle} onChange={setValue('facebook_handle')} placeholder="Facebook handle @yourhandle">Facebook handle @yourhandle</TextField>
                    <TextField value={form.x_handle} onChange={setValue('x_handle')} placeholder="Twitter (X) handle @yourhandle">Twitter (X) handle @yourhandle</TextField>
                </div>

                <strong className='flex'>Taxes</strong>
                <div className="grid grid-cols-4 gap-3">
                    <TextField value={form.gst_number} onChange={(v) => { setValue('gst_number')(v); }} placeholder="Enter gst number">GST Number</TextField>
                    <TextField value={form.cgst} onChange={(v) => { setValue('cgst')(v); }} placeholder="Enter CGST %">CGST %</TextField>
                    <TextField value={form.sgst} onChange={(v) => setValue('sgst')(v)} placeholder="Enter SGST %">SGST %</TextField>
                    <TextField value={form.igst} onChange={(v) => setValue('igst')(v)} placeholder="Enter IGST % (Inter-state)">IGST %</TextField>
                </div>
                <strong className='flex'>Referrer Earning Withdrawal</strong>
                <div className="grid grid-cols-4 gap-3">
                    <TextField value={form.min_earning_withdrawal} onChange={setValue('min_earning_withdrawal')} placeholder="Enter min withdrawal limit for referrer">Min Withdrawal Limit</TextField>
                </div>

                <span className='text-center flex items-center justify-center w-full text-3xl font-bold'>Website Content</span>
                <hr></hr>
                <strong className='flex'>Landing Page</strong>
                <div className="grid grid-cols-2 gap-3">
                    <TextField value={form.landing_title} onChange={setValue('landing_title')} placeholder="Landing main headline">Landing Title</TextField>
                    <TextField value={form.landing_subtitle} onChange={setValue('landing_subtitle')} placeholder="Short supporting text">Landing Subtitle</TextField>

                    <TextField value={form.feature_cards_title} onChange={setValue('feature_cards_title')} placeholder="Features section title">Features Title</TextField>
                    <TextField value={form.feature_cards_subtitle} onChange={setValue('feature_cards_subtitle')} placeholder="Features section subtitle">Features Subtitle</TextField>

                    <TextField value={form.video_section_title} onChange={setValue('video_section_title')} placeholder="Video section title">Video Title</TextField>
                    <TextField value={form.video_section_subtitle} onChange={setValue('video_section_subtitle')} placeholder="Video section subtitle">Video Subtitle</TextField>

                    <TextField value={form.institution_keypoints_title} onChange={setValue('institution_keypoints_title')} placeholder="Key points section title">Key Points Title</TextField>
                    <TextField value={form.institution_keypoints_subtitle} onChange={setValue('institution_keypoints_subtitle')} placeholder="Key points section subtitle">Key Points Subtitle</TextField>

                    <TextField value={form.testimonials_title} onChange={setValue('testimonials_title')} placeholder="Testimonials section title">Testimonials Title</TextField>
                    <TextField value={form.testimonials_subtitle} onChange={setValue('testimonials_subtitle')} placeholder="Testimonials section subtitle">Testimonials Subtitle</TextField>

                    <TextField value={form.pricing_title} onChange={setValue('pricing_title')} placeholder="Pricing section title">Pricing Title</TextField>
                    <TextField value={form.pricing_subtitle} onChange={setValue('pricing_subtitle')} placeholder="Pricing section subtitle">Pricing Subtitle</TextField>

                    <TextField value={form.faqs_title} onChange={setValue('faqs_title')} placeholder="FAQs section title">FAQs Title</TextField>
                    <TextField value={form.faqs_subtitle} onChange={setValue('faqs_subtitle')} placeholder="FAQs section subtitle">FAQs Subtitle</TextField>

                    <TextField value={form.blogs_title} onChange={setValue('blogs_title')} placeholder="Blogs section title">Blogs Title</TextField>
                    <TextField value={form.blogs_subtitle} onChange={setValue('blogs_subtitle')} placeholder="Blogs section subtitle">Blogs Subtitle</TextField>

                    <TextField value={form.news_title} onChange={setValue('news_title')} placeholder="News section title">News Title</TextField>
                    <TextField value={form.news_subtitle} onChange={setValue('news_subtitle')} placeholder="News section subtitle">News Subtitle</TextField>

                    <TextField value={form.contact_cta_title} onChange={setValue('contact_cta_title')} placeholder="Contact section title">Contact CTA Title</TextField>
                    <TextField value={form.contact_cta_subtitle} onChange={setValue('contact_cta_subtitle')} placeholder="Contact section subtitle">Contact CTA Subtitle</TextField>

                    <TextField value={form.cta_title} onChange={setValue('cta_title')} placeholder="Final call to action title">Final CTA Title</TextField>
                    <TextField value={form.cta_subtitle} onChange={setValue('cta_subtitle')} placeholder="Final call to action subtitle">Final CTA Subtitle</TextField>

                </div>

                <strong className='flex'>Enable Disable Sections in Landing Page</strong>
                <div className="grid grid-cols-4 gap-3">
                    <Radio value={form.show_counts_section} onChange={setValue('show_counts_section')} options={YesNoArray}>Show Counts section in landing ?</Radio>
                    <Radio value={form.show_video_section} onChange={setValue('show_video_section')} options={YesNoArray}>Show video section in landing ?</Radio>
                    <Radio value={form.show_content_for_school} onChange={setValue('show_content_for_school')} options={YesNoArray}>Show content card for schools ?</Radio>
                    <Radio value={form.show_content_for_college} onChange={setValue('show_content_for_college')} options={YesNoArray}>Show content card for colleges ?</Radio>
                    <Radio value={form.show_content_for_coaching} onChange={setValue('show_content_for_coaching')} options={YesNoArray}>Show content card for coashing centers ?</Radio>
                    <Radio value={form.show_stats_section} onChange={setValue('show_stats_section')} options={YesNoArray}>Show stats strip ?</Radio>
                </div>

                {!!form.show_counts_section && <>
                    <strong className='flex'>Landing Counts Section</strong>

                    <div className="grid grid-cols-4 gap-3">
                        <TextField value={form.count_1_value} onChange={setValue('count_1_value')} placeholder="Count 1 Value">Count 1 Value</TextField>
                        <TextField value={form.count_2_value} onChange={setValue('count_2_value')} placeholder="Count 2 Value">Count 2 Value</TextField>
                        <TextField value={form.count_3_value} onChange={setValue('count_3_value')} placeholder="Count 3 Value">Count 3 Value</TextField>
                        <TextField value={form.count_4_value} onChange={setValue('count_4_value')} placeholder="Count 4 Value">Count 4 Value</TextField>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                        <TextField value={form.count_1_label} onChange={setValue('count_1_label')} placeholder="Count 1 Label">Count 1 Label</TextField>
                        <TextField value={form.count_2_label} onChange={setValue('count_2_label')} placeholder="Count 2 Label">Count 2 Label</TextField>
                        <TextField value={form.count_3_label} onChange={setValue('count_3_label')} placeholder="Count 3 Label">Count 3 Label</TextField>
                        <TextField value={form.count_4_label} onChange={setValue('count_4_label')} placeholder="Count 4 Label">Count 4 Label</TextField>
                    </div>
                </>}

                {!!form.show_video_section && <>
                    <strong className='flex'>Landing Video Section</strong>

                    <div className="grid grid-cols-4 gap-3">
                        <TextField value={form.landing_video_url} onChange={setValue('landing_video_url')} placeholder="Youtube Video URL">Youtube video url</TextField>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                        <TextField value={form.landing_video_card_1_label} onChange={setValue('landing_video_card_1_label')} placeholder="Video Card 1 Label">Video Card 1 Label</TextField>
                        <TextField value={form.landing_video_card_1_value} onChange={setValue('landing_video_card_1_value')} placeholder="Video Card 1 Value">Video Card 1 Value</TextField>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        <TextField value={form.landing_video_card_2_label} onChange={setValue('landing_video_card_2_label')} placeholder="Video Card 2 Label">Video Card 2 Label</TextField>
                        <TextField value={form.landing_video_card_2_value} onChange={setValue('landing_video_card_2_value')} placeholder="Video Card 2 Value">Video Card 2 Value</TextField>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        <TextField value={form.landing_video_card_3_label} onChange={setValue('landing_video_card_3_label')} placeholder="Video Card 3 Label">Video Card 3 Label</TextField>
                        <TextField value={form.landing_video_card_3_value} onChange={setValue('landing_video_card_3_value')} placeholder="Video Card 3 Value">Video Card 3 Value</TextField>
                    </div>
                </>}

                <div className='grid grid-cols-3 gap-3'>
                    {!!form.show_content_for_school && <div>
                        <strong className='flex'>Content Card Details for Schools</strong>
                        <div className="max-w-xl flex flex-col gap-3">
                            <TextField value={form.school_card_title} onChange={setValue('school_card_title')} placeholder="Title">Title</TextField>
                            <TextField value={form.school_card_description} onChange={setValue('school_card_description')} placeholder="Description" multiline>Description</TextField>
                            <TextField value={form.school_card_points} onChange={setValue('school_card_points')} placeholder="Key Points" multiline rows={10} subtitle='Each line will be shown as point'>Key Points</TextField>
                        </div>
                    </div>}

                    {!!form.show_content_for_college && <div>
                        <strong className='flex'>Content Card Details for College</strong>
                        <div className="max-w-xl flex flex-col gap-3">
                            <TextField value={form.college_card_title} onChange={setValue('college_card_title')} placeholder="Title">Title</TextField>
                            <TextField value={form.college_card_description} onChange={setValue('college_card_description')} placeholder="Description" multiline>Description</TextField>
                            <TextField value={form.college_card_points} onChange={setValue('college_card_points')} placeholder="Key Points" multiline rows={10} subtitle='Each line will be shown as point'>Key Points</TextField>
                        </div>
                    </div>}

                    {!!form.show_content_for_coaching && <div>
                        <strong className='flex'>Content Card Details for Coaching Centers</strong>
                        <div className="max-w-xl flex flex-col gap-3">
                            <TextField value={form.coaching_card_title} onChange={setValue('coaching_card_title')} placeholder="Title">Title</TextField>
                            <TextField value={form.coaching_card_description} onChange={setValue('coaching_card_description')} placeholder="Description" multiline>Description</TextField>
                            <TextField value={form.coaching_card_points} onChange={setValue('coaching_card_points')} placeholder="Key Points" multiline rows={10} subtitle='Each line will be shown as point'>Key Points</TextField>
                        </div>
                    </div>}

                </div>


                {!!form.show_stats_section && <div>
                    <strong className='flex'>Stats Section</strong>
                    <div className="grid grid-cols-3 gap-3">
                        <TextField value={form.stat_section_title} onChange={setValue('stat_section_title')} placeholder="Trusted by Institutions Worldwide">Section Title</TextField>
                        <TextField value={form.stat_section_description} onChange={setValue('stat_section_description')} placeholder="Join hundreds of educational institutions achieving excellence">Section Description</TextField>

                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <TextField value={form.stat_1_value} onChange={setValue('stat_1_value')} placeholder="2M+">Stat 1 Value</TextField>
                        <TextField value={form.stat_1_label} onChange={setValue('stat_1_label')} placeholder="Students Managed">Stat 1 Label</TextField>
                        <TextField value={form.stat_1_description} onChange={setValue('stat_1_description')} placeholder="Across all institutions">Stat 1 Description</TextField>

                        <TextField value={form.stat_2_value} onChange={setValue('stat_2_value')} placeholder="500+">Stat 2 Value</TextField>
                        <TextField value={form.stat_2_label} onChange={setValue('stat_2_label')} placeholder="Active Institutions">Stat 2 Label</TextField>
                        <TextField value={form.stat_2_description} onChange={setValue('stat_2_description')} placeholder="Schools, colleges & coaching centers">Stat 2 Description</TextField>

                        <TextField value={form.stat_3_value} onChange={setValue('stat_3_value')} placeholder="10K+">Stat 3 Value</TextField>
                        <TextField value={form.stat_3_label} onChange={setValue('stat_3_label')} placeholder="Daily Active Users">Stat 3 Label</TextField>
                        <TextField value={form.stat_3_description} onChange={setValue('stat_3_description')} placeholder="Teachers, students & parents">Stat 3 Description</TextField>

                        <TextField value={form.stat_4_value} onChange={setValue('stat_4_value')} placeholder="40%">Stat 4 Value</TextField>
                        <TextField value={form.stat_4_label} onChange={setValue('stat_4_label')} placeholder="Cost Reduction">Stat 4 Label</TextField>
                        <TextField value={form.stat_4_description} onChange={setValue('stat_4_description')} placeholder="Average operational savings">Stat 4 Description</TextField>

                        <TextField value={form.stat_5_value} onChange={setValue('stat_5_value')} placeholder="99.9%">Stat 5 Value</TextField>
                        <TextField value={form.stat_5_label} onChange={setValue('stat_5_label')} placeholder="Uptime Guarantee">Stat 5 Label</TextField>
                        <TextField value={form.stat_5_description} onChange={setValue('stat_5_description')} placeholder="Reliable & always available">Stat 5 Description</TextField>

                        <TextField value={form.stat_6_value} onChange={setValue('stat_6_value')} placeholder="95%">Stat 6 Value</TextField>
                        <TextField value={form.stat_6_label} onChange={setValue('stat_6_label')} placeholder="Satisfaction Rate">Stat 6 Label</TextField>
                        <TextField value={form.stat_6_description} onChange={setValue('stat_6_description')} placeholder="Customer happiness score">Stat 6 Description</TextField>
                    </div>

                </div>}

            </AppCard>
            <div className='h-[150px]'></div>

        </AppPage>
    );
};

export default SettingsManagement;