import AppCard from '@/components/app/AppCard'
import { useSetValue } from '@/hooks/use-set-value';
import { useEffect, useState } from 'react'
import { msg } from '@/lib/msg';
import CenterLoading from '@/components/common/CenterLoading';
import { useGlobalContext } from '@/hooks/use-global-context';
import { OrganizationOnboardingStepsProps } from '../StoreEditor';

import { useDefaultParams } from '@/hooks/use-default-params';
import Radio from '@/components/common/Radio';
import { YesNoArray } from '@/data/Common';

import TextField from '@/components/common/TextField';
import { StoreService } from '@/services/StoreService';
import Richtext from '@/components/common/Richtext';
import NoRecords from '@/components/common/NoRecords';
import { LuCog } from 'react-icons/lu';



export default function StoreOnboardingStepSettings({ organization_id, onLoading, registerCallback, $state }: OrganizationOnboardingStepsProps & {
    organization_id?: number
}) {
    const { id } = useDefaultParams<{ id: string }>(organization_id ? { id: `${organization_id}` } : undefined);
    const [form, setForm] = useState<any>({
        all_categories: 1
    });
    const setValue = useSetValue(setForm);
    const [loading, setLoading] = useState(true);
    const { setContext } = useGlobalContext();
    const load = async () => {
        setLoading(true);
        var r = await StoreService.loadSettings(Number(id));
        if (r.success) {
            setForm(r.data);
            setLoading(false);
        }
    }

    useEffect(() => {
        registerCallback?.(async () => {
            if (!form.is_custom_domain) {
                return true;
            }
            var r = await StoreService.saveSettings({ ...$state, ...form, id: Number(id) });
            if (r.success) {
                setContext(c => ({ ...c, admission_progress: r.data.progress }));
                msg.success('Details saved successfuly');
            }
            return r.success;
        })
    });

    useEffect(() => {
        onLoading?.(loading);
    }, [loading])

    useEffect(() => {
        if (!!id) {
            load();
        } else {
            setLoading(false);
        }
    }, []);


    if (loading) {
        return <CenterLoading className="relative h-[400px]" />
    }

    return (
        <AppCard
            title='Settings'
            subtitle='Maintain various settings which will effect the store page'
            mainClassName="rounded-none border-none shadow-none"
            contentClassName="px-6 pb-6 flex flex-col gap-6"

        >
            {!!form.is_custom_domain &&
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField value={form.company_name} onChange={setValue('company_name')} placeholder="Company Name">Company Name</TextField>
                        <TextField value={form.tagline} onChange={setValue('tagline')} placeholder="Tagline">Tagline</TextField>
                    </div>

                    <strong className='flex'>Address Details (Billing Purposes)</strong>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6 mb-6">

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

                    </div>
                    <div className=''>
                        <Richtext value={form.store_document_instructions} onChange={setValue('store_document_instructions')}>Document Instructions</Richtext>
                    </div>
                    <strong className='flex'>Referrer Earning Withdrawal</strong>
                    <div className="grid grid-cols-4 gap-3">
                        <TextField value={form.min_earning_withdrawal} onChange={setValue('min_earning_withdrawal')} placeholder="Enter min withdrawal limit for referrer">Min Withdrawal Limit</TextField>
                        <TextField value={form.referral_link_expiry_duration} onChange={setValue('referral_link_expiry_duration')} placeholder="Enter expiry duration">Referral Link Expiry Duration (Days)</TextField>
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
                </>}
            {!form.is_custom_domain && <NoRecords icon={LuCog} title='No Settings Avaiable' subtitle='Settings are only avaiable for stores which have cusotm domains' />}

        </AppCard>
    )
}
