import { NavItem } from "@/components/app/CommonLayout";
import { MdOutlineCategory } from "react-icons/md";
import { PiRanking } from "react-icons/pi";
import { LuCalendarClock, LuHouse } from "react-icons/lu";

import { BsJournalBookmarkFill, BsPatchQuestion } from "react-icons/bs";
import { VscGroupByRefType } from "react-icons/vsc";

export const ExamNavs: NavItem[] = [
    { icon: LuHouse, label: 'Dashboard', section: 'main', route: '' },
    { icon: PiRanking, label: 'Exams', section: 'main', route: 'exams' },
    { icon: BsPatchQuestion, label: 'Question Sets', section: 'main', route: 'exam-question-groups' },
    { icon: LuCalendarClock, label: 'Time Slots', section: 'management', route: 'time-slots' },
    { icon: MdOutlineCategory, label: 'Exam Categories', section: 'management', route: 'exam-categories' },
    { icon: LuCalendarClock, label: 'Subjects', section: 'management', route: 'subjects' },
    { icon: BsJournalBookmarkFill, label: 'Chapters', section: 'management', route: 'chapters' },
    { icon: VscGroupByRefType, label: 'Sections', section: 'management', route: 'sections' }
];