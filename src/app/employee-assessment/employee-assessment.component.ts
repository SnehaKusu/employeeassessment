import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import emailjs from '@emailjs/browser';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employee-assessment',
  standalone: true,
  templateUrl: './employee-assessment.component.html',
  styleUrls: ['./employee-assessment.component.scss'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class EmployeeAssessmentComponent {
  assessmentForm: FormGroup;
  category: string = '';
  successMessage: string = '';
  errorMessage: string = '';
  score: number | null = null;

  // ✅ Declare question properties
  workplaceBehaviorQuestions: any[] = [];
  teamworkQuestions: any[] = [];
  emotionalIntelligenceQuestions: any[] = [];
  personalDevelopmentQuestions: any[] = [];
  additionalQuestions: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.assessmentForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^\\d{10}$')]],
      organization: ['', Validators.required],
      role: ['', Validators.required],
      yearsOfExperience: ['', Validators.required],
      currentCTC: ['', Validators.required],
      expectedCTC: ['', Validators.required],
      linkedIn: ['', Validators.pattern('https?://.+')],
      bio: [''],
      location: ['', Validators.required]
    });

    this.restoreScore(); // ✅ Restore score on page load

    // ✅ Initialize question properties with values (No questions removed)
    this.workplaceBehaviorQuestions = [
      { label: "How often do you feel motivated to complete tasks at work?", control: "motivation", options: ["Never", "Sometimes", "Often", "Always"] },
      { label: "Do you prefer to work on independent tasks or in collaborative environments?", control: "workPreference", options: ["Independent tasks", "Collaborative environments"] },
      { label: "How often do you find yourself completing tasks ahead of deadlines?", control: "deadline", options: ["Never", "Sometimes", "Often", "Always"] },
      { label: "Do you feel overwhelmed by your workload?", control: "overwhelmed", options: ["Never", "Occasionally", "Often", "Always"] },
      { label: "How comfortable are you with adapting to new work processes or tools?", control: "adapting", options: ["Not Comfortable", "Slightly Comfortable", "Comfortable", "Very Comfortable"] },
      { label: "Do you enjoy taking on leadership roles when working on projects?", control: "Leadership", options: ["Never", "Sometimes", "Often", "Always"] },
      { label: "How do you handle long-term projects with minimal direction or guidance?", control: "LongTerm", options: ["Struggle to manage", "Occasionally need help", "Manage with occasional guidance", "Manage independently"] },
      { label: "How do you prioritize your tasks at work?", control: "prioritize", options: ["I focus on urgent tasks first", "Focus on easy tasks first", "I plan and prioritize effectively", "I have difficulty prioritizing"] },
      { label: "How often do you seek feedback from colleagues or supervisors?", control: "feedback", options: ["Never", "Sometimes", "Often", "Always"] },
      { label: "How often do you feel satisfied with the work you produce?", control: "satisfaction", options: ["Rarely", "Occasionally", "Often", "Always"] }
    ];
    this.teamworkQuestions = [
      { label: "How comfortable are you with sharing your ideas in team meetings?", control: "sharingIdeas", options: ["Not comfortable", "Slightly comfortable", "Comfortable", "Very comfortable"] },
      { label: "How often do you collaborate with others on group projects?", control: "collaborate", options: ["Never", "Sometimes", "Often", "Always"] },
      {label:"How do you typically handle disagreements within a team?" ,control:"Disagreements",options:["Avoid Conflict","Discuss Calmly","Assertively express my opinion","Become Confrontational"]},
      {label:"How often do you offer help or support to teammates when needed?" ,control:"Support",options:["Never","Occasionally","Often","Always"]},
      {label:"How do you feel about giving and receiving constructive feedback?" ,control:"Constructive Feedback",options:["Uncomfortable","Neutral","Comfortable","Very comfortable"]},
      {label:"How well do you handle working with individuals from diverse backgrounds or perspectives?" ,control:"Background",options:["Not well","Sometimes struggle","Handle it well","Excel in diverse teams"]},
      {label:"How often do you take the lead in team discussions or meetings?" ,control:"Lead",options:["Never","Sometimes","Often","Always"]},
      {label:"How comfortable are you with receiving feedback from others?" ,control:"Receiving feedback",options:["Not comfortable","Slightly comfortable","Comfortable","Very comfortable"]},
      {label:"Do you often try to understand your teammates’ emotions or perspectives?" ,control:"emotion",options:["Never","Occasionally","Often","Always"]},
      {label:"Do you prefer to work with a close-knit group of colleagues or a larger team?" ,control:"Group",options:["Close-knit group","Larger team","No preference"]},
    ];

    this.emotionalIntelligenceQuestions = [
      { label: "How often do you find it easy to manage your emotions at work?", control: "manageEmotions", options: ["Never", "Sometimes", "Often", "Always"] },
      { label: "How do you respond when faced with a stressful situation at work?", control: "stressResponse", options: ["Panic", "Become anxious", "Stay calm", "Take proactive action"] },
      {label:"How often do you empathize with your colleagues during difficult situations?" ,control:"empathize",options:["Never","Sometimes","Often","Always"]},
      {label:"When dealing with conflicts, do you try to understand the other person’s point of view?" ,control:"Dealing",options:["Never","Sometimes","Often","Always"]},
      {label:"How often do you feel frustrated or irritated at work?" ,control:"Frustrated",options:["Never","Sometimes","Often","Always"]},
      {label:"Do you find it difficult to separate personal feelings from professional situations?" ,control:"Personal feelings",options:["Never","Sometimes","Often","Always"]},
      {label:"How do you typically respond when a colleague gives you negative feedback?" ,control:"Negative Feedback",options:["Defensive","Neutral","Appreciate it","Use it as a learning opportunity"]},
      {label:"Do you find it easy to express your emotions in a constructive manner?" ,control:"Constructive manner",options:["Never","Sometimes","Often","Always"]},
      {label:"How often do you recognize when your emotions are affecting your work?" ,control:"Recognize emotions",options:["Never","Sometimes","Often","Always"]},
      {label:"How often do you find yourself feeling motivated by challenges or difficult situations at work?" ,control:"motivations",options:["Never","Sometimes","Often","Always"]},
    ];

    this.personalDevelopmentQuestions = [
      { label: "How often do you seek opportunities for personal or professional growth?", control: "growthOpportunities", options: ["Rarely", "Occasionally", "Often", "Always"] },
      { label: "Are you open to learning new skills or improving existing ones?", control: "learningOpenness", options: ["Not open", "Slightly open", "Open", "Very open"] },
      {label:"Do you set goals for your professional development?" ,control:"Professional Development",options:["Never","Occasionally","Often","Always"]},
      {label:"How often do you engage in activities that enhance your work-related knowledge?" ,control:"Work-related Knowledge",options:["Rarely","Occasionally","Often","Always"]},
      {label:"Do you actively seek feedback on your performance from others?" ,control:"Performance",options:["Never","Occasionally","Often","Always"]},
      {label:"How often do you feel you are achieving your career goals?" ,control:"Career goals",options:["Never","Occasionally","Often","Always"]},
      {label:"How often do you engage in self-reflection to improve your performance?" ,control:"Achieving",options:["Never","Occasionally","Often","Always"]},
      {label:"How important is professional development to you?" ,control:"Importance",options:["Not Important","Slightly important ","Important","Very important"]},
      {label:"Do you often explore new ways to improve your work habits?" ,control:"new ways",options:["Never","Occasionally","Often","Always"]},
      {label:"How comfortable are you with changing the way you approach work tasks or problems?" ,control:"Approach",options:["Not comfortable","Slightly comfortable","Comfortable","Very comfortable"]},
    ];

    this.additionalQuestions = [
      { label: "How likely are you to speak up if you feel something is wrong at work?", control: "speakUp", options: ["Not likely", "Slightly likely", "Likely", "Very likely"] },
      { label: "How often do you feel inspired or energized by the work you do?", control: "workInspiration", options: ["Never", "Sometimes", "Often", "Always"] },
      {label:"How do you feel about remote work or flexible work arrangements?" ,control:"flexibility",options:["Uncomfortable","Neutral","Comfortable","Very comfortable"]},
      {label:"How do you typically handle multiple tasks or projects at once?" ,control:"handle multiple tasks",options:["Struggle to manage","Occasionally need help","Manage effectively","Thrive in multi-tasking"]},
      {label:"How do you react to change or unexpected situations at work?" ,control:"reaction",options:["Resist","Hesitate","Adapt slowly","Embrace"]},
    ];


    this.addQuestionControls(this.workplaceBehaviorQuestions);
    this.addQuestionControls(this.teamworkQuestions);
    this.addQuestionControls(this.emotionalIntelligenceQuestions);
    this.addQuestionControls(this.personalDevelopmentQuestions);
    this.addQuestionControls(this.additionalQuestions);
  }

  addQuestionControls(questions: any[]) {
    questions.forEach(q => this.assessmentForm.addControl(q.control, this.fb.control('', Validators.required)));
  }

  calculateScore(): void {
    let totalScore = 0;
    const scoreMapping: { [key: string]: number } = {
      "Never": 0, "Rarely": 0, "Not likely": 0, "Slightly likely": 1,
      "Sometimes": 1, "Occasionally": 1, "Often": 2, "Likely": 2,
      "Always": 3, "Very likely": 3
    };

    Object.keys(this.assessmentForm.controls).forEach(key => {
      const value = this.assessmentForm.get(key)?.value;
      if (scoreMapping[value] !== undefined) {
        totalScore += scoreMapping[value];
      }
    });

    this.score = totalScore;
    this.saveScore(); // ✅ Save score locally

    if (this.score >= 121) {
      this.category = "🌟 Exceptional Emotional Intelligence, Leadership, and Collaboration";
    } else if (this.score >= 81) {
      this.category = "😊 High Emotional Intelligence and Teamwork";
    } else if (this.score >= 41) {
      this.category = "😐 Moderate Emotional Intelligence and Teamwork";
    } else {
      this.category = "😟 Low Emotional Intelligence and Teamwork";
    }
  }

  // ✅ Save score in local storage to persist after form submission
  saveScore(): void {
    if (this.score !== null) {
      localStorage.setItem('assessmentScore', this.score.toString());
      localStorage.setItem('assessmentCategory', this.category);
    }
  }

  // ✅ Restore score when the user revisits the page
  restoreScore(): void {
    const savedScore = localStorage.getItem('assessmentScore');
    const savedCategory = localStorage.getItem('assessmentCategory');
    if (savedScore !== null) {
      this.score = parseInt(savedScore, 10);
    }
    if (savedCategory !== null) {
      this.category = savedCategory;
    }
  }

  onSubmit(): void {
    this.calculateScore();

    if (!this.assessmentForm.valid) {
      this.errorMessage = "❌ Please fill all required fields correctly.";
      return;
    }

    const formData = { ...this.assessmentForm.value, score: this.score, category: this.category };

    // ✅ Send data to backend
    this.http.post('http://localhost:5000/submit-assessment', formData, {
      headers: { 'Content-Type': 'application/json' }
    }).subscribe({
      next: (response: any) => {
        console.log("✅ Data successfully saved to backend:", response);
        this.successMessage = "✅ Your details have been submitted successfully!";
        this.errorMessage = "";
        this.assessmentForm.reset();
      },
      error: (error) => {
        console.error("❌ Error saving data to backend:", error);
        this.successMessage = "";
        this.errorMessage = "❌ Failed to submit to backend. Please try again.";
      }
    });

    // ✅ Send data to EmailJS
    emailjs.send(
      'service_kg9t0u1',
      'template_577l61j',
      formData,
      '2smLy7ekuzjYvz1yF'
    ).then(
      (response) => {
        console.log('✅ Email Sent Successfully:', response.status, response.text);
        this.successMessage = '✅ Your details have been submitted successfully!';
        this.errorMessage = '';
        this.assessmentForm.reset();
      },
      (error) => {
        console.error('❌ EmailJS Failed:', error);
        this.successMessage = '';
        this.errorMessage = '❌ There was an error sending your details. Please try again.';
      }
    );
  }

  toggleTheme(): void {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', currentTheme === 'light' ? 'dark' : 'light');
  }
}
