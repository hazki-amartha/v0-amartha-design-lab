import type { SurveyConfig } from "./survey-types"

export function generateSurveyHtml(config: SurveyConfig): string {
  if (config.mode === "2-step") {
    return generate2StepHtml(config)
  }
  return generate4StepHtml(config)
}

function generate2StepHtml(config: SurveyConfig): string {
  const q = config.question1
  const answersHtml = q.answers
    .map(
      (ans, i) =>
        `                    <li class="choice-item">
                        <button class="choice-btn" onclick="selectCSAT('topup', ${i + 1}, '${escHtml(ans)}')">
                            ${escHtml(ans)}
                        </button>
                    </li>`
    )
    .join("\n")

  return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="format-detection" content="telephone=no">
    <title>AmarthaFin CSAT Survey</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20,400,0,0" />
    <style>
        :root {
            --primary: #84359B;
            --primary-foreground: #ffffff;
            --background: #F3F6FD;
            --text: #1a1a1a;
            --text-muted: #666666;
            --border: #e5e5e5;
            --accent: #f4f4f4;
        }

        * {
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
        }

        body {
            font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: var(--text);
            display: flex;
            align-items: flex-start;
            justify-content: center;
            min-height: 100vh;
            overflow-x: hidden;
            pointer-events: auto !important;
        }

        .survey-container {
            display: flex;
            flex-direction: column;
            width: 100%;
            max-width: 500px;
            max-height: 520px;
            height: 100%;  
            background-color: var(--background);
            border-radius: 16px;
            overflow: hidden;
            animation: fadeIn 0.5s ease-out;
            pointer-events: auto;
            position: relative;
            z-index: 9999;
        }

        .survey-body {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
            padding-bottom: 96px;
            -webkit-overflow-scrolling: touch;
        }

        /* Sticky footer */
        .survey-footer {
            position: relative;
            bottom: 0;
            background: var(--background);
            padding: 16px 24px;
            border-top: 1px solid var(--border);
        }

        .survey-header {
        position: sticky;
        top: 0;
        z-index: 9999;
        height: 32px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center; 
        }

        .icon-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 1px solid var(--border);
        background: white;
        color: var(--text);
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        padding: 0;
        }

        .icon-btn .material-symbols-rounded {
        font-size: 18px;
        }

        .icon-btn:active {
        background: var(--accent);
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        h2 {
            font-size: 22px;
            line-height: 1.3;
            margin-bottom: 32px;
            font-weight: 600;
        }

        [hidden] {
            display: none !important;
        }
        
        .question-label {
            display: block;
            font-size: 14px;
            color: var(--text-muted);
            margin-top: 16px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        /* Step 1: CSAT Multiple Choice */
        .choice-list {
            list-style: none;
            padding: 0;
            margin: 0 0 32px 0;
        }

        .choice-item {
            margin-bottom: 12px;
        }

        .choice-btn {
            width: 100%;
            padding: 14px;
            text-align: left;
            background: white;
            border: 1px solid var(--border);
            border-radius: 12px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: space-between;
            -webkit-user-select: none;
            user-select: none;
            touch-action: manipulation;
            pointer-events: auto !important;
            position: relative;
            z-index: 999 !important;
        }
        
        .choice-btn:hover {
            background-color: var(--accent);
        }

        .choice-btn:active, .choice-btn.selected {
            background-color: var(--accent);
            border-color: var(--primary);
        }

        .choice-btn::after {
            content: "";
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid var(--border);
            background: white;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .choice-btn.selected::after {
            background-color: var(--primary);
            border-color: var(--primary);
            box-shadow: inset 0 0 0 4px white;
        }

        .other-input-container {
            margin-top: 12px;
            display: none;
        }

        .other-input-container.visible {
            display: block;
        }

        .other-input {
            width: 100%;
            padding: 14px;
            background: white;
            border: 1px solid var(--border);
            border-radius: 12px;
            font-size: 14px;
            font-family: inherit;
            resize: vertical;
            min-height: 80px;
            transition: border-color 0.2s ease;
        }

        .other-input:focus {
            outline: none;
            border-color: var(--primary);
        }

        /* Submit button */
        .submit-btn {
            width: 100%;
            padding: 16px;
            background-color: var(--primary);
            color: var(--primary-foreground);
            border: none;
            border-radius: 40px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            touch-action: manipulation;
            pointer-events: auto !important;
            position: relative;
            z-index: 999 !important;
        }

        .submit-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .submit-btn:active:not(:disabled) {
            transform: scale(0.98);
        }

        /* Thank you page */
        .thank-you-content {
            text-align: center;
            padding: 32px 0;
        }

        .thank-you-content h2 {
            margin-bottom: 16px;
        }

        .checkmark {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            background-color: var(--primary);
            margin: 0 auto 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: scaleUp 0.5s ease-out;
        }

        @keyframes scaleUp {
            from { transform: scale(0); }
            to { transform: scale(1); }
        }

        .checkmark::before {
            content: '\\2713';
            color: white;
            font-size: 40px;
            font-weight: bold;
        }

    </style>
</head>
<body>

    <div class="survey-container">

        <div class="survey-body" id="survey-body">

            <!-- Header with close button -->
        <div class="survey-header">
            <button class="icon-btn" id="back-btn" onclick="goBack()" aria-label="Back" hidden>
              <span class="material-symbols-rounded">arrow_back</span>
            </button>
            <div id="back-btn-placeholder" style="width:36px;"></div>
            <button class="icon-btn" onclick="closeSurvey()" aria-label="Close survey">
              <span class="material-symbols-rounded">close</span>
            </button>
          </div>

            <!-- Step 1: CSAT Question -->
            <div class="survey-step" id="survey-step-1">
                <span class="question-label">Pertanyaan 1 dari 2</span>
                <h2>${escHtml(q.questionLabel)}</h2>
                
                <ul class="choice-list">
${answersHtml}
                </ul>
            </div>

            <!-- Step 2: Follow-up Question -->
            <div class="survey-step" id="survey-step-2" hidden>
                <span class="question-label">Pertanyaan 2 dari 2</span>
                <h2 id="followup-question-title"></h2>

                <ul class="choice-list" id="followup-choices">
                    <!-- Options will be dynamically inserted here -->
                </ul>

                <div class="other-input-container" id="other-input-container">
                    <textarea 
                        id="other-input" 
                        class="other-input" 
                        placeholder="Tulis alasan Anda di sini..."
                        oninput="updateSubmitButton()"
                    ></textarea>
                </div>
            </div>

            <!-- Thank you screen -->
            <div class="survey-step" id="survey-step-thankyou" hidden>
                <div class="thank-you-content">
                    <div class="checkmark"></div>
                    <h2>Terima kasih atas masukan Anda!</h2>
                    <p style="color: var(--text-muted); text-align: center;">
                        Masukan Anda sangat membantu kami meningkatkan layanan AmarthaFin.
                      </p>
                </div>

            </div>

        </div>  
        
        <!-- Sticky footer (only used in step 2) -->
        <div class="survey-footer" id="surveyFooter" hidden>
            <button class="submit-btn" id="submit-btn" onclick="submitSurvey()">
            Kirim Masukan
            </button>
        </div>

    </div>

    <script>
        let surveyData = {
            topup: {
                score: null,
                label: null,
                category: null,
                feedback: null,
                context: ${JSON.stringify(q.context)}
            }
        };

        const surveyFooter = document.getElementById('surveyFooter');
        const submitBtn = document.getElementById('submit-btn');

        // Define follow-up questions based on CSAT score — Q1 (Top-up)
        const followupQuestionsQ1 = {
            dissatisfied: {
                title: ${JSON.stringify(q.followup.dissatisfiedTitle)},
                options: ${JSON.stringify([...q.followup.dissatisfiedOptions, "Lainnya"])}
            },
            delighted: {
                title: ${JSON.stringify(q.followup.delightedTitle)},
                options: ${JSON.stringify([...q.followup.delightedOptions, "Lainnya"])}
            }
        };

        function showStep(step) {
            document.querySelectorAll('.survey-step')
                .forEach(el => el.hidden = true);

            document.getElementById(\`survey-step-\${step}\`).hidden = false;

            // Header + footer logic
            surveyFooter.hidden = step !== 2;

            // Back button: hide on step 1 and thankyou, show on step 2
            const backBtn = document.getElementById('back-btn');
            const backBtnPlaceholder = document.getElementById('back-btn-placeholder');
            const showBack = step === 2;
            backBtn.hidden = !showBack;
            backBtnPlaceholder.hidden = showBack;
        }

        function goBack() {
            const steps = [1, 2];
            const activeStep = steps.find(s => !document.getElementById(\`survey-step-\${s}\`).hidden);
            if (activeStep && activeStep > 1) {
                showStep(activeStep - 1);
            }
        }
        
        function selectCSAT(questionKey, score, label) {
            surveyData[questionKey].score = score;
            surveyData[questionKey].label = label;
            surveyData[questionKey].category = getCSATCategory(score);

            const stepMap = { topup: 1, divest: 3 };
            const nextStepMap = { topup: 2, divest: 4 };

            // Visual feedback
            document.querySelectorAll(\`#survey-step-\${stepMap[questionKey]} .choice-btn\`).forEach(btn => {
                btn.classList.remove('selected');
            });
            event.target.classList.add('selected');

            // Auto-advance to next step after a short delay
            setTimeout(() => {
                showFollowupQuestion(questionKey);
                showStep(nextStepMap[questionKey]);
            }, 300);
        }

        function getCSATCategory(score) {
            if (score <= 3) return "dissatisfied";
            if (score === 4) return "satisfied";
            return "delighted";
        }

        function showFollowupQuestion(questionKey) {
            const titleIdMap = { topup: 'followup-question-title' };
            const choicesIdMap = { topup: 'followup-choices' };
            const otherContainerIdMap = { topup: 'other-input-container' };
            const otherInputIdMap = { topup: 'other-input' };

            const questionType = surveyData[questionKey].category === "delighted" ? "delighted" : "dissatisfied";
            const followup = followupQuestionsQ1[questionType];

            document.getElementById(titleIdMap[questionKey]).textContent = followup.title;

            const choicesContainer = document.getElementById(choicesIdMap[questionKey]);
            choicesContainer.innerHTML = '';

            followup.options.forEach(option => {
                const choiceItem = document.createElement('div');
                choiceItem.className = 'choice-item';
                const button = document.createElement('button');
                button.className = 'choice-btn';
                button.textContent = option;
                button.onclick = () => toggleFollowupChoice(questionKey, button, option);
                choiceItem.appendChild(button);
                choicesContainer.appendChild(choiceItem);
            });

            document.getElementById(otherContainerIdMap[questionKey]).classList.remove('visible');
            document.getElementById(otherInputIdMap[questionKey]).value = '';
            updateSubmitButton();
        }

        function toggleFollowupChoice(questionKey, btn, value) {
            const choicesIdMap = { topup: '#followup-choices' };
            const otherContainerIdMap = { topup: 'other-input-container' };
            const otherInputIdMap = { topup: 'other-input' };

            document.querySelectorAll(\`\${choicesIdMap[questionKey]} .choice-btn\`).forEach(b => {
                b.classList.remove('selected');
            });
            btn.classList.add('selected');
            surveyData[questionKey].feedback = value;

            const otherInputContainer = document.getElementById(otherContainerIdMap[questionKey]);
            if (value === 'Lainnya') {
                otherInputContainer.classList.add('visible');
                document.getElementById(otherInputIdMap[questionKey]).focus();
            } else {
                otherInputContainer.classList.remove('visible');
                document.getElementById(otherInputIdMap[questionKey]).value = '';
            }

            updateSubmitButton();
        }

        function updateSubmitButton() {
            const isOtherSelected = surveyData.topup.feedback === 'Lainnya';
            const otherInputValue = document.getElementById('other-input').value.trim();
            submitBtn.disabled = isOtherSelected ? otherInputValue === '' : !surveyData.topup.feedback;
        }
        
        function closeSurvey() {
        // Android
        if (window.CleverTap && window.CleverTap.dismissInAppNotification) {
            window.CleverTap.dismissInAppNotification();
        }

        // iOS
        if (
            window.webkit &&
            window.webkit.messageHandlers &&
            window.webkit.messageHandlers.clevertap
        ) {
            window.webkit.messageHandlers.clevertap.postMessage({
            action: "dismissInAppNotification"
            });
        }
        }

        function submitSurvey() {
            if (!surveyData.topup.feedback) return;
            if (surveyData.topup.feedback === 'Lainnya') {
                const otherVal = document.getElementById('other-input').value.trim();
                if (!otherVal) return;
                surveyData.topup.feedback = otherVal;
            }

            const eventName = "CSAT Survey Submitted";

            const eventProps = {
                csat_score: surveyData.topup.score,
                csat_label: surveyData.topup.label,
                csat_category: surveyData.topup.category,
                detailed_feedback: surveyData.topup.feedback,
                trigger_event: surveyData.topup.context,
                survey_completed: true
            };

            // ---- ANDROID (CleverTap Android SDK) ----
            if (window.CleverTap && typeof window.CleverTap.pushEvent === "function") {
                window.CleverTap.pushEvent(eventName, JSON.stringify(eventProps));
            }

            // ---- iOS (CleverTap iOS SDK) ----
            if (
                window.webkit &&
                window.webkit.messageHandlers &&
                window.webkit.messageHandlers.clevertap
            ) {
                window.webkit.messageHandlers.clevertap.postMessage({
                    action: "recordEventWithProps",
                    event: eventName,
                    props: eventProps
                });
            }

            // Show thank you screen
            showStep('thankyou');
            surveyFooter.hidden = true;

            // ---- OPTIONAL: Dismiss IAM ----
            setTimeout(() => {
                // Android
                if (window.CleverTap && window.CleverTap.dismissInAppNotification) {
                    window.CleverTap.dismissInAppNotification();
                }

                // iOS
                if (
                    window.webkit &&
                    window.webkit.messageHandlers &&
                    window.webkit.messageHandlers.clevertap
                ) {
                    window.webkit.messageHandlers.clevertap.postMessage({
                        action: "dismissInAppNotification"
                    });
                }
            }, 2000);

            console.log("Survey submitted:", eventProps);
        }
    </script>
</body>
</html>`
}

function generate4StepHtml(config: SurveyConfig): string {
  const q1 = config.question1
  const q2 = config.question2

  const answersHtml1 = q1.answers
    .map(
      (ans, i) =>
        `                    <li class="choice-item">
                        <button class="choice-btn" onclick="selectCSAT('topup', ${i + 1}, '${escHtml(ans)}')">
                            ${escHtml(ans)}
                        </button>
                    </li>`
    )
    .join("\n")

  const answersHtml2 = q2.answers
    .map(
      (ans, i) =>
        `                    <li class="choice-item">
                        <button class="choice-btn" onclick="selectCSAT('divest', ${i + 1}, '${escHtml(ans)}')">
                            ${escHtml(ans)}
                        </button>
                    </li>`
    )
    .join("\n")

  return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="format-detection" content="telephone=no">
    <title>AmarthaFin CSAT Survey</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20,400,0,0" />
    <style>
        :root {
            --primary: #84359B;
            --primary-foreground: #ffffff;
            --background: #F3F6FD;
            --text: #1a1a1a;
            --text-muted: #666666;
            --border: #e5e5e5;
            --accent: #f4f4f4;
        }

        * {
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
        }

        body {
            font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: var(--text);
            display: flex;
            align-items: flex-start;
            justify-content: center;
            min-height: 100vh;
            overflow-x: hidden;
            pointer-events: auto !important;
        }

        .survey-container {
            display: flex;
            flex-direction: column;
            width: 100%;
            max-width: 500px;
            max-height: 520px;
            height: 100%;  
            background-color: var(--background);
            border-radius: 16px;
            overflow: hidden;
            animation: fadeIn 0.5s ease-out;
            pointer-events: auto;
            position: relative;
            z-index: 9999;
        }

        .survey-body {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
            padding-bottom: 96px;
            -webkit-overflow-scrolling: touch;
        }

        /* Sticky footer */
        .survey-footer {
            position: relative;
            bottom: 0;
            background: var(--background);
            padding: 16px 24px;
            border-top: 1px solid var(--border);
        }

        .survey-header {
        position: sticky;
        top: 0;
        z-index: 9999;
        height: 32px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center; 
        }

        .icon-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 1px solid var(--border);
        background: white;
        color: var(--text);
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        padding: 0;
        }

        .icon-btn .material-symbols-rounded {
        font-size: 18px;
        }

        .icon-btn:active {
        background: var(--accent);
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        h2 {
            font-size: 22px;
            line-height: 1.3;
            margin-bottom: 32px;
            font-weight: 600;
        }

        [hidden] {
            display: none !important;
        }
        
        .question-label {
            display: block;
            font-size: 14px;
            color: var(--text-muted);
            margin-top: 16px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        /* Step 1: CSAT Multiple Choice */
        .choice-list {
            list-style: none;
            padding: 0;
            margin: 0 0 32px 0;
        }

        .choice-item {
            margin-bottom: 12px;
        }

        .choice-btn {
            width: 100%;
            padding: 14px;
            text-align: left;
            background: white;
            border: 1px solid var(--border);
            border-radius: 12px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: space-between;
            -webkit-user-select: none;
            user-select: none;
            touch-action: manipulation;
            pointer-events: auto !important;
            position: relative;
            z-index: 999 !important;
        }
        
        .choice-btn:hover {
            background-color: var(--accent);
        }

        .choice-btn:active, .choice-btn.selected {
            background-color: var(--accent);
            border-color: var(--primary);
        }

        .choice-btn::after {
            content: "";
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid var(--border);
            background: white;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .choice-btn.selected::after {
            background-color: var(--primary);
            border-color: var(--primary);
            box-shadow: inset 0 0 0 4px white;
        }

        .other-input-container {
            margin-top: 12px;
            display: none;
        }

        .other-input-container.visible {
            display: block;
        }

        .other-input {
            width: 100%;
            padding: 14px;
            background: white;
            border: 1px solid var(--border);
            border-radius: 12px;
            font-size: 14px;
            font-family: inherit;
            resize: vertical;
            min-height: 80px;
            transition: border-color 0.2s ease;
        }

        .other-input:focus {
            outline: none;
            border-color: var(--primary);
        }

        /* Submit button */
        .submit-btn {
            width: 100%;
            padding: 16px;
            background-color: var(--primary);
            color: var(--primary-foreground);
            border: none;
            border-radius: 40px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            touch-action: manipulation;
            pointer-events: auto !important;
            position: relative;
            z-index: 999 !important;
        }

        .submit-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .submit-btn:active:not(:disabled) {
            transform: scale(0.98);
        }

        /* Thank you page */
        .thank-you-content {
            text-align: center;
            padding: 32px 0;
        }

        .thank-you-content h2 {
            margin-bottom: 16px;
        }

        .checkmark {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            background-color: var(--primary);
            margin: 0 auto 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: scaleUp 0.5s ease-out;
        }

        @keyframes scaleUp {
            from { transform: scale(0); }
            to { transform: scale(1); }
        }

        .checkmark::before {
            content: '\\2713';
            color: white;
            font-size: 40px;
            font-weight: bold;
        }

    </style>
</head>
<body>

    <div class="survey-container">

        <div class="survey-body" id="survey-body">

            <!-- Header with close button -->
        <div class="survey-header">
            <button class="icon-btn" id="back-btn" onclick="goBack()" aria-label="Back" hidden>
              <span class="material-symbols-rounded">arrow_back</span>
            </button>
            <div id="back-btn-placeholder" style="width:36px;"></div>
            <button class="icon-btn" onclick="closeSurvey()" aria-label="Close survey">
              <span class="material-symbols-rounded">close</span>
            </button>
          </div>

            <!-- Step 1: CSAT Question -->
            <div class="survey-step" id="survey-step-1">
                <span class="question-label">Pertanyaan 1 dari 4</span>
                <h2>${escHtml(q1.questionLabel)}</h2>
                
                <ul class="choice-list">
${answersHtml1}
                </ul>
            </div>

            <!-- Step 2: Follow-up Question -->
            <div class="survey-step" id="survey-step-2" hidden>
                <span class="question-label">Pertanyaan 2 dari 4</span>
                <h2 id="followup-question-title"></h2>

                <ul class="choice-list" id="followup-choices">
                    <!-- Options will be dynamically inserted here -->
                </ul>

                <div class="other-input-container" id="other-input-container">
                    <textarea 
                        id="other-input" 
                        class="other-input" 
                        placeholder="Tulis alasan Anda di sini..."
                        oninput="updateSubmitButton()"
                    ></textarea>
                </div>
            </div>

            <!-- Step 3: CSAT Question 2 -->
            <div class="survey-step" id="survey-step-3" hidden>
                <span class="question-label">Pertanyaan 3 dari 4</span>
                <h2>${escHtml(q2.questionLabel)}</h2>
                
                <ul class="choice-list">
${answersHtml2}
                </ul>
            </div>

            <!-- Step 4: Follow-up Question 2 -->
            <div class="survey-step" id="survey-step-4" hidden>
                <span class="question-label">Pertanyaan 4 dari 4</span>
                <h2 id="followup-question-title-2"></h2>

                <ul class="choice-list" id="followup-choices-2">
                    <!-- Options will be dynamically inserted here -->
                </ul>

                <div class="other-input-container" id="other-input-container-2">
                    <textarea 
                        id="other-input-2" 
                        class="other-input" 
                        placeholder="Tulis alasan Anda di sini..."
                        oninput="updateSubmitButton()"
                    ></textarea>
                </div>
            </div>

            <!-- Thank you screen -->
            <div class="survey-step" id="survey-step-thankyou" hidden>
                <div class="thank-you-content">
                    <div class="checkmark"></div>
                    <h2>Terima kasih atas masukan Anda!</h2>
                    <p style="color: var(--text-muted); text-align: center;">
                        Masukan Anda sangat membantu kami meningkatkan layanan AmarthaFin.
                      </p>
                </div>

            </div>

        </div>  
        
        <!-- Sticky footer (only used in step 2) -->
        <div class="survey-footer" id="surveyFooter" hidden>
            <button class="submit-btn" id="submit-btn" onclick="submitSurvey()">
            Kirim Masukan
            </button>
        </div>

    </div>

    <script>
        let surveyData = {
            topup: {
                score: null,
                label: null,
                category: null,
                feedback: null,
                context: ${JSON.stringify(q1.context)}
            },
            divest: {
                score: null,
                label: null,
                category: null,
                feedback: null,
                context: ${JSON.stringify(q2.context)}
            }
        };

        const surveyFooter = document.getElementById('surveyFooter');
        const submitBtn = document.getElementById('submit-btn');

        // Define follow-up questions based on CSAT score — Q1 (Top-up)
        const followupQuestionsQ1 = {
            dissatisfied: {
                title: ${JSON.stringify(q1.followup.dissatisfiedTitle)},
                options: ${JSON.stringify([...q1.followup.dissatisfiedOptions, "Lainnya"])}
            },
            delighted: {
                title: ${JSON.stringify(q1.followup.delightedTitle)},
                options: ${JSON.stringify([...q1.followup.delightedOptions, "Lainnya"])}
            }
        };

        // Define follow-up questions based on CSAT score — Q2 (Divest)
        const followupQuestionsQ2 = {
            dissatisfied: {
                title: ${JSON.stringify(q2.followup.dissatisfiedTitle)},
                options: ${JSON.stringify([...q2.followup.dissatisfiedOptions, "Lainnya"])}
            },
            delighted: {
                title: ${JSON.stringify(q2.followup.delightedTitle)},
                options: ${JSON.stringify([...q2.followup.delightedOptions, "Lainnya"])}
            }
        };

        function showStep(step) {
            document.querySelectorAll('.survey-step')
                .forEach(el => el.hidden = true);

            document.getElementById(\`survey-step-\${step}\`).hidden = false;

            // Header + footer logic
            surveyFooter.hidden = (step !== 2 && step !== 4);

            // Back button: hide on step 1 and thankyou, show on all others
            const backBtn = document.getElementById('back-btn');
            const backBtnPlaceholder = document.getElementById('back-btn-placeholder');
            const showBack = (step === 2 || step === 3 || step === 4);
            backBtn.hidden = !showBack;
            backBtnPlaceholder.hidden = showBack;

            // Update button label
            if (step === 2) {
                submitBtn.textContent = 'Lanjut';
            } else if (step === 4) {
                submitBtn.textContent = 'Kirim Masukan';
            }
        }

        function goBack() {
            const steps = [1, 2, 3, 4];
            const activeStep = steps.find(s => !document.getElementById(\`survey-step-\${s}\`).hidden);
            if (activeStep && activeStep > 1) {
                showStep(activeStep - 1);
            }
        }
        
        function selectCSAT(questionKey, score, label) {
            surveyData[questionKey].score = score;
            surveyData[questionKey].label = label;
            surveyData[questionKey].category = getCSATCategory(score);

            const stepMap = { topup: 1, divest: 3 };
            const nextStepMap = { topup: 2, divest: 4 };

            // Visual feedback
            document.querySelectorAll(\`#survey-step-\${stepMap[questionKey]} .choice-btn\`).forEach(btn => {
                btn.classList.remove('selected');
            });
            event.target.classList.add('selected');

            // Auto-advance to next step after a short delay
            setTimeout(() => {
                showFollowupQuestion(questionKey);
                showStep(nextStepMap[questionKey]);
            }, 300);
        }

        function getCSATCategory(score) {
            if (score <= 3) return "dissatisfied";
            if (score === 4) return "satisfied";
            return "delighted";
        }

        function showFollowupQuestion(questionKey) {
            const questionsMap = { topup: followupQuestionsQ1, divest: followupQuestionsQ2 };
            const titleIdMap = { topup: 'followup-question-title', divest: 'followup-question-title-2' };
            const choicesIdMap = { topup: 'followup-choices', divest: 'followup-choices-2' };
            const otherContainerIdMap = { topup: 'other-input-container', divest: 'other-input-container-2' };
            const otherInputIdMap = { topup: 'other-input', divest: 'other-input-2' };

            const questionType = surveyData[questionKey].category === "delighted" ? "delighted" : "dissatisfied";
            const followup = questionsMap[questionKey][questionType];

            document.getElementById(titleIdMap[questionKey]).textContent = followup.title;

            const choicesContainer = document.getElementById(choicesIdMap[questionKey]);
            choicesContainer.innerHTML = '';

            followup.options.forEach(option => {
                const choiceItem = document.createElement('div');
                choiceItem.className = 'choice-item';
                const button = document.createElement('button');
                button.className = 'choice-btn';
                button.textContent = option;
                button.onclick = () => toggleFollowupChoice(questionKey, button, option);
                choiceItem.appendChild(button);
                choicesContainer.appendChild(choiceItem);
            });

            document.getElementById(otherContainerIdMap[questionKey]).classList.remove('visible');
            document.getElementById(otherInputIdMap[questionKey]).value = '';
            updateSubmitButton();
        }

        function toggleFollowupChoice(questionKey, btn, value) {
            const choicesIdMap = { topup: '#followup-choices', divest: '#followup-choices-2' };
            const otherContainerIdMap = { topup: 'other-input-container', divest: 'other-input-container-2' };
            const otherInputIdMap = { topup: 'other-input', divest: 'other-input-2' };

            document.querySelectorAll(\`\${choicesIdMap[questionKey]} .choice-btn\`).forEach(b => {
                b.classList.remove('selected');
            });
            btn.classList.add('selected');
            surveyData[questionKey].feedback = value;

            const otherInputContainer = document.getElementById(otherContainerIdMap[questionKey]);
            if (value === 'Lainnya') {
                otherInputContainer.classList.add('visible');
                document.getElementById(otherInputIdMap[questionKey]).focus();
            } else {
                otherInputContainer.classList.remove('visible');
                document.getElementById(otherInputIdMap[questionKey]).value = '';
            }

            updateSubmitButton();
        }

        function updateSubmitButton() {
            // Determine which step is currently active
            const step2Active = !document.getElementById('survey-step-2').hidden;
            const step4Active = !document.getElementById('survey-step-4').hidden;

            if (step2Active) {
                const isOtherSelected = surveyData.topup.feedback === 'Lainnya';
                const otherInputValue = document.getElementById('other-input').value.trim();
                submitBtn.disabled = isOtherSelected ? otherInputValue === '' : !surveyData.topup.feedback;
            } else if (step4Active) {
                const isOtherSelected = surveyData.divest.feedback === 'Lainnya';
                const otherInputValue = document.getElementById('other-input-2').value.trim();
                submitBtn.disabled = isOtherSelected ? otherInputValue === '' : !surveyData.divest.feedback;
            } else {
                submitBtn.disabled = true;
            }
        }
        
        function closeSurvey() {
        // Android
        if (window.CleverTap && window.CleverTap.dismissInAppNotification) {
            window.CleverTap.dismissInAppNotification();
        }

        // iOS
        if (
            window.webkit &&
            window.webkit.messageHandlers &&
            window.webkit.messageHandlers.clevertap
        ) {
            window.webkit.messageHandlers.clevertap.postMessage({
            action: "dismissInAppNotification"
            });
        }
        }

        function submitSurvey() {
            const step2Active = !document.getElementById('survey-step-2').hidden;
            const step4Active = !document.getElementById('survey-step-4').hidden;

            if (step2Active) {
                // Finalize Q1 feedback
                if (!surveyData.topup.feedback) return;
                if (surveyData.topup.feedback === 'Lainnya') {
                    const otherVal = document.getElementById('other-input').value.trim();
                    if (!otherVal) return;
                    surveyData.topup.feedback = otherVal;
                }

                // Update button label and advance to Q2 CSAT
                submitBtn.textContent = 'Kirim Masukan';
                submitBtn.disabled = true;
                showStep(3);
                return;
            }

            if (step4Active) {
                // Finalize Q2 feedback
                if (!surveyData.divest.feedback) return;
                if (surveyData.divest.feedback === 'Lainnya') {
                    const otherVal = document.getElementById('other-input-2').value.trim();
                    if (!otherVal) return;
                    surveyData.divest.feedback = otherVal;
                }

                const eventName = "CSAT Survey Submitted";

                const topupProps = {
                    csat_score: surveyData.topup.score,
                    csat_label: surveyData.topup.label,
                    csat_category: surveyData.topup.category,
                    detailed_feedback: surveyData.topup.feedback,
                    trigger_event: surveyData.topup.context,
                    survey_completed: true
                };

                const divestProps = {
                    csat_score: surveyData.divest.score,
                    csat_label: surveyData.divest.label,
                    csat_category: surveyData.divest.category,
                    detailed_feedback: surveyData.divest.feedback,
                    trigger_event: surveyData.divest.context,
                    survey_completed: true
                };

                // ---- ANDROID (CleverTap Android SDK) ----
                if (window.CleverTap && typeof window.CleverTap.pushEvent === "function") {
                    window.CleverTap.pushEvent(eventName, JSON.stringify(topupProps));
                    window.CleverTap.pushEvent(eventName, JSON.stringify(divestProps));
                }

                // ---- iOS (CleverTap iOS SDK) ----
                if (
                    window.webkit &&
                    window.webkit.messageHandlers &&
                    window.webkit.messageHandlers.clevertap
                ) {
                    window.webkit.messageHandlers.clevertap.postMessage({
                        action: "recordEventWithProps",
                        event: eventName,
                        props: topupProps
                    });
                    window.webkit.messageHandlers.clevertap.postMessage({
                        action: "recordEventWithProps",
                        event: eventName,
                        props: divestProps
                    });
                }

                // Show thank you screen
                showStep('thankyou');
                surveyFooter.hidden = true;

                // ---- OPTIONAL: Dismiss IAM ----
                setTimeout(() => {
                    // Android
                    if (window.CleverTap && window.CleverTap.dismissInAppNotification) {
                        window.CleverTap.dismissInAppNotification();
                    }

                    // iOS
                    if (
                        window.webkit &&
                        window.webkit.messageHandlers &&
                        window.webkit.messageHandlers.clevertap
                    ) {
                        window.webkit.messageHandlers.clevertap.postMessage({
                            action: "dismissInAppNotification"
                        });
                    }
                }, 2000);

                console.log("Survey submitted:", { topupProps, divestProps });
            }
        }
    </script>
</body>
</html>`
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}
