export function generateQuestionPrompt(state: any) {
    const types = {
        MCQ: 0,
        MULTI_SELECT: 1,
        FILL_BLANKS: 2,
        TRUE_FALSE: 3,
        MATCHING: 4,
        NUMERICAL: 5,
        DESCRIPTIVE: 6,
        ASSERTION: 7,
        MATRIX: 8,
        SEQUENCE: 9
    };

    const allowedTypes = Object.entries(types).map(([name, id]) => `${name}(${id})`).join(', ');
    return `Generate ${state.questions.length} exam questions.
Output ONLY valid JSON array of objects matching this format (use exact field names, no extras):
[{
    "subject_id": "numeric",
    "exam_section_id" : "numeric",
    "question": "string|required|min:6",
    "question_type": "numeric|one of: ${allowedTypes}",
    "is_completed": 1,
    "positive_marks": "numeric|min:0|default:1",
    "negative_marks": "numeric|max:0|default:0",
    "answer": "nullable|string|max:150",
    "options": "nullable|array|for MCQ/MULTI_SELECT/ASSERTION only|min:1|each: {text: string|min:1, is_correct: 0|1}|exactly one is_correct=1 for MCQ, multiple for MULTI_SELECT, one for ASSERTION",
    "pairs": "nullable|array|for MATCHING only|min:1|each: {left: string, right: string}",
    "word_limit": "nullable|numeric|for DESCRIPTIVE only|min:1",
    "rows": "nullable|array|for MATRIX only|min:1|each: {text: string}",
    "cols": "nullable|array|for MATRIX only|min:1|each: {text: string}",
    "items": "nullable|array|for SEQUENCE only|min:1|each: {id: numeric, text: string|min:1}",
    "explanation": "string|optional"
}]

to feed suject_id and exam_section_id here is the mapping which will give you item for which subject and section what type of questions needs to be generated

${JSON.stringify(state.subjects.map((subject: any) => {
        return {
            id: subject.id,
            name: subject.name,
            sections: subject.sections.map((section: any) => ({
                id: section.id,
                name: section.name
            }))
        };
    }), null, 4)}

question_type must be numeric
Rules by question_type:
- MCQ (0): Use options array, 4 options typical, one correct.
- MULTI_SELECT (1): Use options array, 4 options typical, 2+ correct.
- FILL_BLANKS (2): answer required string.
- TRUE_FALSE (3): answer must be "true" or "false" (lowercase).
- MATCHING (4): Use pairs array, 4+ pairs.
- NUMERICAL (5): answer required valid number (integer/float).
- DESCRIPTIVE (6): word_limit required >=50, no answer/options.
- ASSERTION (7): Use options array, 4 options typical (e.g., A both true reason explains, B both true reason doesn't, etc.), one correct.
- MATRIX (8): Use rows/cols arrays, 3x3 typical, no answer.
- SEQUENCE (9): Use items array, 4+ items, ids sequential 1-N.
Ensure each question min 6 chars, realistic for topic/difficulty.`;
}