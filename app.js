// Dynamic Chinese Learning Web App Logic
// Teacher Hyejin's Personal Homepage

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Navigation & Header UI Effects
    // ==========================================
    const header = document.getElementById('main-header');
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // Header Shrink on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '10px 0';
            header.style.background = 'rgba(15, 5, 6, 0.95)';
        } else {
            header.style.padding = '0';
            header.style.background = 'rgba(15, 5, 6, 0.8)';
        }
        
        // Highlight active nav link (Scroll Spy)
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // Mobile Navigation Menu Toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    });


    // ==========================================
    // 2. Tab Menu switching for Study Hub
    // ==========================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');

            // Remove active states
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active state to clicked elements
            button.classList.add('active');
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });


    // ==========================================
    // 3. Web Speech API (Text-To-Speech Reader)
    // ==========================================
    const ttsInput = document.getElementById('tts-input');
    const ttsSpeed = document.getElementById('tts-speed');
    const speedVal = document.getElementById('speed-val');
    const ttsVoice = document.getElementById('tts-voice');
    const btnTtsSpeak = document.getElementById('btn-tts-speak');
    const btnTtsClear = document.getElementById('btn-tts-clear');
    const audioWave = document.getElementById('audio-wave');
    
    let synth = window.speechSynthesis;
    let voices = [];

    // Populate voice dropdown with Mandarin options
    function loadVoices() {
        if (!synth) return;
        voices = synth.getVoices();
        
        // Filter standard Mandarin / Chinese voices
        const chineseVoices = voices.filter(voice => 
            voice.lang.includes('zh-CN') || 
            voice.lang.includes('zh-') || 
            voice.lang.includes('zh_CN')
        );

        // Clear default option except placeholder
        ttsVoice.innerHTML = '';
        
        if (chineseVoices.length > 0) {
            chineseVoices.forEach(voice => {
                const option = document.createElement('option');
                option.value = voice.name;
                option.textContent = `${voice.name} (${voice.lang})`;
                ttsVoice.appendChild(option);
            });
        } else {
            const option = document.createElement('option');
            option.value = 'default';
            option.textContent = '시스템 기본 중국어 음성 (Chinese)';
            ttsVoice.appendChild(option);
        }
    }

    loadVoices();
    if (synth && synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = loadVoices;
    }

    // Speed slider display updates
    if (ttsSpeed) {
        ttsSpeed.addEventListener('input', (e) => {
            speedVal.textContent = e.target.value;
        });
    }

    // Speak function
    function speakText(text) {
        if (!synth) {
            alert('이 브라우저는 음성 합성(Speech Synthesis)을 지원하지 않습니다.');
            return;
        }

        if (synth.speaking) {
            synth.cancel(); // Stop current speech
        }

        if (text !== '') {
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Speed setup
            utterance.rate = parseFloat(ttsSpeed.value) || 1.0;
            
            // Voice selection
            const selectedVoiceName = ttsVoice.value;
            if (selectedVoiceName !== 'default') {
                const matchedVoice = voices.find(voice => voice.name === selectedVoiceName);
                if (matchedVoice) {
                    utterance.voice = matchedVoice;
                }
            } else {
                // If default is selected, explicitly request a Chinese locale fallback
                utterance.lang = 'zh-CN';
            }

            // Wave animation control
            utterance.onstart = () => {
                audioWave.classList.add('playing');
            };
            
            utterance.onend = () => {
                audioWave.classList.remove('playing');
            };
            
            utterance.onerror = () => {
                audioWave.classList.remove('playing');
            };

            synth.speak(utterance);
        }
    }

    if (btnTtsSpeak) {
        btnTtsSpeak.addEventListener('click', () => {
            speakText(ttsInput.value);
        });
    }

    if (btnTtsClear) {
        btnTtsClear.addEventListener('click', () => {
            ttsInput.value = '';
            speakText('');
        });
    }


    // ==========================================
    // 4. Interactive Flashcards Module
    // ==========================================
    const cardDecks = {
        hsk1: [
            { char: '学习', pinyin: 'xuéxí', meaning: '공부하다, 배우다', exCh: '我们在学校学习汉语。', exPy: 'Wǒmen zài xuéxiào xuéxí Hànyǔ.', exKr: '우리는 학교에서 중국어를 배운다.' },
            { char: '谢谢', pinyin: 'xièxie', meaning: '고맙다, 감사하다', exCh: '谢谢你帮我。', exPy: 'Xièxie nǐ bāng wǒ.', exKr: '도와주셔서 감사합니다.' },
            { char: '医生', pinyin: 'yīshēng', meaning: '의사', exCh: '我爸爸是医生。', exPy: 'Wǒ bāba shì yīshēng.', exKr: '우리 아버지는 의사이십니다.' },
            { char: '苹果', pinyin: 'píngguǒ', meaning: '사과', exCh: '我喜欢吃苹果。', exPy: 'Wǒ xǐhuan chī píngguǒ.', exKr: '나는 사과 먹는 것을 좋아한다.' },
            { char: '电脑', pinyin: 'diànnǎo', meaning: '컴퓨터', exCh: '我买了一个新电脑。', exPy: 'Wǒ mǎile yí ge xīn diànnǎo.', exKr: '나는 새 컴퓨터를 샀다.' },
            { char: '猫', pinyin: 'māo', meaning: '고양이', exCh: '这只小猫很可爱。', exPy: 'Zhè zhī xiǎomāo hěn kě’ài.', exKr: '이 새끼 고양이는 아주 귀엽다.' },
            { char: '朋友', pinyin: 'péngyou', meaning: '친구', exCh: '他是我的好朋友。', exPy: 'Tā shì wǒ de hǎo péngyou.', exKr: '그는 나의 좋은 친구다.' },
            { char: '认识', pinyin: 'rènshi', meaning: '알다, 알게 되다', exCh: '很高兴认识你。', exPy: 'Hěn gāoxìng rènshi nǐ.', exKr: '당신을 알게 되어 기쁩니다.' },
            { char: '漂亮', pinyin: 'piàoliang', meaning: '예쁘다, 아름답다', exCh: '你的衣服很漂亮。', exPy: 'Nǐ de yīfu hěn piàoliang.', exKr: '네 옷이 참 예쁘다.' },
            { char: '衣服', pinyin: 'yīfu', meaning: '옷, 의복', exCh: '我去买几件衣服。', exPy: 'Wǒ qù mǎi jǐ jiàn yīfu.', exKr: '나는 옷을 몇 벌 사러 간다.' }
        ],
        hsk2: [
            { char: '准备', pinyin: 'zhǔnbèi', meaning: '준비하다', exCh: '我准备好了。', exPy: 'Wǒ zhǔnbèi hǎo le.', exKr: '나는 준비를 마쳤다.' },
            { char: '旅游', pinyin: 'lǚyóu', meaning: '여행하다', exCh: '我去中国旅游。', exPy: 'Wǒ qù Zhōngguó lǚyóu.', exKr: '나는 중국으로 여행을 간다.' },
            { char: '便宜', pinyin: 'piányi', meaning: '싸다, 저렴하다', exCh: '这件衣服很便宜。', exPy: 'Zhè jiàn yīfu hěn piányi.', exKr: '이 옷은 아주 저렴하다.' },
            { char: '唱歌', pinyin: 'chànggē', meaning: '노래 부르다', exCh: '妹妹喜欢唱歌。', exPy: 'Mèimei xǐhuan chànggē.', exKr: '여동생은 노래 부르는 걸 좋아한다.' },
            { char: '帮助', pinyin: 'bāngzhù', meaning: '돕다, 원조하다', exCh: '谢谢你的帮助。', exPy: 'Xièxie nǐ de bāngzhù.', exKr: '도와주셔서 감사합니다.' },
            { char: '介绍', pinyin: 'jièshào', meaning: '소개하다', exCh: '让我介绍一下。', exPy: 'Ràng wǒ jièshào yíxià.', exKr: '제가 소개해 보겠습니다.' },
            { char: '希望', pinyin: 'xīwàng', meaning: '희망하다, 바라다', exCh: '我希望你去。', exPy: 'Wǒ xīwàng nǐ qù.', exKr: '나는 네가 가기를 바란다.' },
            { char: '运动', pinyin: 'yùndòng', meaning: '운동하다, 움직이다', exCh: '多运动对身体好。', exPy: 'Duō yùndòng duì shēntǐ hǎo.', exKr: '운동을 많이 하는 것은 몸에 좋다.' },
            { char: '考试', pinyin: 'kǎoshì', meaning: '시험, 시험을 치다', exCh: '明天我有考试。', exPy: 'Míngtiān wǒ yǒu kǎoshì.', exKr: '내일 나는 시험이 있다.' },
            { char: '晴天', pinyin: 'qíngtiān', meaning: '맑은 날', exCh: '今天是晴天。', exPy: 'Jīntiān shì qíngtiān.', exKr: '오늘은 맑은 날이다.' }
        ],
        travel: [
            { char: '多少钱', pinyin: 'duōshao qián', meaning: '얼마예요?', exCh: '这个杯子多少钱？', exPy: 'Zhège bēizi duōshao qián?', exKr: '이 컵은 얼마인가요?' },
            { char: '刷卡', pinyin: 'shuā kǎ', meaning: '카드로 결제하다', exCh: '可以刷卡吗？', exPy: 'Kěyǐ shuā kǎ ma?', exKr: '카드 결제 가능한가요?' },
            { char: '洗手间', pinyin: 'xǐshǒujiān', meaning: '화장실', exCh: '请问，洗手间在哪儿？', exPy: 'Qǐngwèn, xǐshǒujiān zài nǎr?', exKr: '말씀 좀 여쭐게요, 화장실은 어디인가요?' },
            { char: '便宜一点', pinyin: 'piányi yìdiǎn', meaning: '좀 깎아주세요', exCh: '太贵了，便宜一点吧。', exPy: 'Tài guì le, piányi yìdiǎn ba.', exKr: '너무 비싸요, 좀 깎아주세요.' },
            { char: '服务员', pinyin: 'fúwùyuán', meaning: '웨이터, 종업원', exCh: '服务员，点单！', exPy: 'Fúwùyuán, diǎndān!', exKr: '저기요(종업원), 주문할게요!' },
            { char: '打包', pinyin: 'dǎbāo', meaning: '남은 음식을 포장하다', exCh: '剩下的菜我想打包。', exPy: 'Shèngxià de cài wǒ xiǎng dǎbāo.', exKr: '남은 음식 포장하고 싶습니다.' },
            { char: '护照', pinyin: 'hùzhào', meaning: '여권', exCh: '这是我的护照。', exPy: 'Zhè shì wǒ de hùzhào.', exKr: '이것은 제 여권입니다.' },
            { char: '酒店', pinyin: 'jiǔdiàn', meaning: '호텔', exCh: '请带我去这个酒店。', exPy: 'Qǐng dài wǒ qù zhège jiǔdiàn.', exKr: '이 호텔로 데려다 주세요.' },
            { char: '地铁站', pinyin: 'dìtiězhàn', meaning: '지하철역', exCh: '附近有地铁站吗？', exPy: 'Fùjìn yǒu dìtiězhàn ma?', exKr: '근처에 지하철역이 있나요?' },
            { char: '没关系', pinyin: 'méi guānxi', meaning: '괜찮습니다, 상관없다', exCh: '没关系，我不介意。', exPy: 'Méi guānxi, wǒ bú jièyì.', exKr: '괜찮습니다, 신경 쓰지 않아요.' }
        ]
    };

    let currentDeck = 'hsk1';
    let currentCardIndex = 0;

    const flashcard = document.getElementById('main-flashcard');
    const cardChar = document.getElementById('card-char');
    const cardPinyin = document.getElementById('card-pinyin');
    const cardMeaning = document.getElementById('card-meaning');
    const cardExCh = document.getElementById('card-ex-ch');
    const cardExPy = document.getElementById('card-ex-py');
    const cardExKr = document.getElementById('card-ex-kr');
    
    const cardCurrent = document.getElementById('card-current');
    const cardCurrentBack = document.getElementById('card-back-current');
    const cardTotal = document.getElementById('card-total');
    const cardTotalBack = document.getElementById('card-total-back');

    const btnCardPrev = document.getElementById('btn-card-prev');
    const btnCardNext = document.getElementById('btn-card-next');
    const btnCardFlip = document.getElementById('btn-card-flip');
    const btnCardSpeak = document.getElementById('btn-card-speak');
    const catButtons = document.querySelectorAll('.cat-btn');

    // Update Card UI
    function updateCard() {
        const deck = cardDecks[currentDeck];
        const cardData = deck[currentCardIndex];
        
        // Reset card flip position first (always show front first when updating card)
        flashcard.classList.remove('flipped');
        
        setTimeout(() => {
            cardChar.textContent = cardData.char;
            cardPinyin.textContent = cardData.pinyin;
            cardMeaning.textContent = cardData.meaning;
            cardExCh.textContent = cardData.exCh;
            cardExPy.textContent = cardData.exPy;
            cardExKr.textContent = cardData.exKr;
            
            // Progress tracker
            const currentNum = currentCardIndex + 1;
            const totalNum = deck.length;
            cardCurrent.textContent = currentNum;
            cardCurrentBack.textContent = currentNum;
            cardTotal.textContent = totalNum;
            cardTotalBack.textContent = totalNum;
        }, 150); // slight delay to hide content change during unflip transition
    }

    // Toggle Flip
    if (flashcard) {
        flashcard.addEventListener('click', () => {
            flashcard.classList.toggle('flipped');
        });
    }

    if (btnCardFlip) {
        btnCardFlip.addEventListener('click', (e) => {
            e.stopPropagation();
            flashcard.classList.toggle('flipped');
        });
    }

    // Navigation buttons
    if (btnCardPrev) {
        btnCardPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            const deck = cardDecks[currentDeck];
            currentCardIndex = (currentCardIndex - 1 + deck.length) % deck.length;
            updateCard();
        });
    }

    if (btnCardNext) {
        btnCardNext.addEventListener('click', (e) => {
            e.stopPropagation();
            const deck = cardDecks[currentDeck];
            currentCardIndex = (currentCardIndex + 1) % deck.length;
            updateCard();
        });
    }

    // Voice reading for Flashcard Chinese
    if (btnCardSpeak) {
        btnCardSpeak.addEventListener('click', (e) => {
            e.stopPropagation();
            const character = cardDecks[currentDeck][currentCardIndex].char;
            speakText(character);
        });
    }

    // Switch Deck Categories
    catButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            catButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentDeck = btn.getAttribute('data-category');
            currentCardIndex = 0;
            updateCard();
        });
    });

    // Load initial card
    if (cardChar) {
        updateCard();
    }


    // ==========================================
    // 5. Daily Mini Quiz Module
    // ==========================================
    const quizData = [
        {
            korean: '의사',
            correctIndex: 0,
            options: [
                'A. 医生 (yīshēng)',
                'B. 老师 (lǎoshī)',
                'C. 学生 (xuésheng)',
                'D. 朋友 (péngyou)'
            ],
            explanation: '医生(yīshēng)는 의사라는 뜻입니다. 老师는 교사, 学生은 학생입니다.'
        },
        {
            korean: '카드 결제하다 (지불)',
            correctIndex: 2,
            options: [
                'A. 买单 (mǎidān)',
                'B. 打包 (dǎbāo)',
                'C. 刷卡 (shuā kǎ)',
                'D. 便宜 (piányi)'
            ],
            explanation: '刷卡(shuā kǎ)는 신용카드를 긁다(결제하다)라는 뜻입니다. 买单은 계산하다, 打包는 포장하다입니다.'
        },
        {
            korean: '안녕하세요, 만나서 반갑습니다!',
            correctIndex: 1,
            options: [
                'A. 谢谢，祝你今天学习愉快！',
                'B. 你好，很高兴认识你！',
                'C. 没关系，我不介意。',
                'D. 请问，洗手间在哪儿？'
            ],
            explanation: '你好，很高兴认识你！는 "안녕하세요, 당신을 만나 알게 되어 매우 기쁩니다!"라는 일상 핵심 인사말입니다.'
        },
        {
            korean: '여권',
            correctIndex: 3,
            options: [
                'A. 酒店 (jiǔdiàn)',
                'B. 地铁 (dìtiě)',
                'C. 门票 (ménpiào)',
                'D. 护照 (hùzhào)'
            ],
            explanation: '护照(hùzhào)는 여권입니다. 酒店은 호텔, 地铁는 지하철, 门票는 입장권입니다.'
        },
        {
            korean: '괜찮습니다 / 상관없습니다',
            correctIndex: 0,
            options: [
                'A. 没关系 (méi guānxi)',
                'B. 对不起 (duìbuqǐ)',
                'C. 太贵了 (tài guì le)',
                'D. 再见 (zàijiàn)'
            ],
            explanation: '没关系(méi guānxi)는 미안하다는 말에 답하는 "괜찮습니다" 혹은 "상관없습니다"라는 의미입니다.'
        }
    ];

    let quizIndex = 0;
    let quizScore = 0;

    const quizProgress = document.getElementById('quiz-progress');
    const quizCurrentNum = document.getElementById('quiz-current-num');
    const quizTotalNum = document.getElementById('quiz-total-num');
    const quizScoreVal = document.getElementById('quiz-score-val');
    const quizTargetWord = document.getElementById('quiz-target-word');
    const quizOptionsContainer = document.getElementById('quiz-options-container');
    const quizFeedback = document.getElementById('quiz-feedback');
    const quizFeedbackText = document.getElementById('quiz-feedback-text');
    const btnQuizNext = document.getElementById('btn-quiz-next');
    const quizResultScreen = document.getElementById('quiz-result-screen');
    const quizFinalScore = document.getElementById('quiz-final-score');
    const quizResultMsg = document.getElementById('quiz-result-msg');
    const btnQuizRestart = document.getElementById('btn-quiz-restart');
    const quizBody = document.querySelector('.quiz-body');

    // Load Quiz Question
    function loadQuestion() {
        if (quizIndex >= quizData.length) {
            showQuizResults();
            return;
        }

        // Reset elements
        btnQuizNext.classList.add('hidden');
        quizFeedback.classList.add('hidden');
        quizFeedback.classList.remove('success', 'danger');

        // Setup texts
        const question = quizData[quizIndex];
        quizCurrentNum.textContent = quizIndex + 1;
        quizTotalNum.textContent = quizData.length;
        quizScoreVal.textContent = quizScore;
        quizTargetWord.textContent = question.korean;
        
        // Progress bar
        const progressPercentage = ((quizIndex) / quizData.length) * 100;
        quizProgress.style.width = `${progressPercentage}%`;

        // Load buttons
        quizOptionsContainer.innerHTML = '';
        question.options.forEach((optText, index) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-opt';
            btn.textContent = optText;
            btn.dataset.idx = index;
            btn.addEventListener('click', handleOptionSelect);
            quizOptionsContainer.appendChild(btn);
        });
    }

    // Handle Option Click
    function handleOptionSelect(e) {
        const selectedBtn = e.target;
        const selectedIdx = parseInt(selectedBtn.dataset.idx);
        const question = quizData[quizIndex];
        const optionButtons = quizOptionsContainer.querySelectorAll('.quiz-opt');

        // Disable all options
        optionButtons.forEach(btn => btn.disabled = true);

        if (selectedIdx === question.correctIndex) {
            // Correct Answer
            selectedBtn.classList.add('correct');
            quizScore += (100 / quizData.length);
            quizScoreVal.textContent = quizScore;
            
            quizFeedback.className = 'quiz-feedback success';
            quizFeedback.querySelector('i').className = 'fa-solid fa-circle-check';
            quizFeedbackText.textContent = `정답입니다! ${question.explanation}`;
        } else {
            // Incorrect Answer
            selectedBtn.classList.add('incorrect');
            
            // Highlight correct one
            optionButtons[question.correctIndex].classList.add('correct');
            
            quizFeedback.className = 'quiz-feedback danger';
            quizFeedback.querySelector('i').className = 'fa-solid fa-circle-xmark';
            quizFeedbackText.textContent = `오답입니다. ${question.explanation}`;
        }

        quizFeedback.classList.remove('hidden');
        btnQuizNext.classList.remove('hidden');
    }

    // Go to next question
    if (btnQuizNext) {
        btnQuizNext.addEventListener('click', () => {
            quizIndex++;
            loadQuestion();
        });
    }

    // Show Results Panel
    function showQuizResults() {
        quizBody.classList.add('hidden');
        btnQuizNext.classList.add('hidden');
        quizFeedback.classList.add('hidden');
        quizProgress.style.width = '100%';
        
        quizFinalScore.textContent = quizScore;
        
        // Custom message based on score
        if (quizScore === 100) {
            quizResultMsg.textContent = '완벽합니다! 중국어 마스터의 기질이 보입니다. 혜진 선생님과 함께 실전에 도전해 보세요!';
        } else if (quizScore >= 60) {
            quizResultMsg.textContent = '훌륭한 점수입니다! 몇 가지 단어들만 조금 더 보완하면 완벽할 것 같습니다.';
        } else {
            quizResultMsg.textContent = '기초를 조금 더 다져보아요! 제공되는 단어 카드로 복습한 후 다시 도전해 보세요.';
        }
        
        quizResultScreen.classList.remove('hidden');
    }

    // Restart Quiz
    if (btnQuizRestart) {
        btnQuizRestart.addEventListener('click', () => {
            quizIndex = 0;
            quizScore = 0;
            quizBody.classList.remove('hidden');
            quizResultScreen.classList.add('hidden');
            loadQuestion();
        });
    }

    // Load initial quiz
    if (quizTargetWord) {
        loadQuestion();
    }


    // ==========================================
    // 6. Interactive Consultation Form
    // ==========================================
    const consultationForm = document.getElementById('consultation-form');
    const formSuccessAlert = document.getElementById('form-success-alert');
    const btnAlertClose = document.getElementById('btn-alert-close');

    if (consultationForm) {
        consultationForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop default action
            
            // Check form validity
            if (consultationForm.checkValidity()) {
                // Here we would typically send form data to Vercel Serverless Function or email service
                // Formspark, EmailJS, Web3Forms, etc.
                
                // Show success visual prompt
                formSuccessAlert.classList.remove('hidden');
                
                // Reset form inputs
                consultationForm.reset();
            }
        });
    }

    if (btnAlertClose) {
        btnAlertClose.addEventListener('click', () => {
            formSuccessAlert.classList.add('hidden');
        });
    }
});
