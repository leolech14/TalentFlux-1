import jsPDF from 'jspdf';

export interface CVData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    dateOfBirth?: string;
    photo?: string;
  };
  summary: string;
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
    details?: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
    languages?: string[];
  };
  certifications?: Array<{
    name: string;
    issuer: string;
    year: string;
  }>;
}

export function generateCVPDF(data: CVData): Blob {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const lineHeight = 7;
  let yPosition = margin;

  // Colors
  const primaryColor = '#6B46C1'; // Purple
  const textColor = '#1F2937';
  const lightGray = '#9CA3AF';

  // Helper functions
  const addText = (text: string, x: number, y: number, options?: any) => {
    doc.text(text, x, y, options);
  };

  const addLine = (x1: number, y1: number, x2: number, y2: number) => {
    doc.line(x1, y1, x2, y2);
  };

  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Header with photo
  doc.setFillColor(245, 243, 255); // Light purple background
  doc.rect(0, 0, pageWidth, 60, 'F');

  // Add photo if available
  if (data.personalInfo.photo) {
    try {
      doc.addImage(data.personalInfo.photo, 'JPEG', margin, 15, 30, 30);
    } catch (error) {
      console.error('Error adding photo to PDF:', error);
    }
  }

  // Personal Info
  const photoOffset = data.personalInfo.photo ? 40 : 0;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(primaryColor);
  addText(data.personalInfo.name, margin + photoOffset, 30);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(textColor);
  addText(data.personalInfo.title, margin + photoOffset, 40);

  // Contact info
  doc.setFontSize(10);
  doc.setTextColor(lightGray);
  const contactY = 50;
  let contactX = margin + photoOffset;
  
  addText(data.personalInfo.email, contactX, contactY);
  contactX += doc.getTextWidth(data.personalInfo.email) + 10;
  addText('|', contactX - 5, contactY);
  
  addText(data.personalInfo.phone, contactX, contactY);
  contactX += doc.getTextWidth(data.personalInfo.phone) + 10;
  addText('|', contactX - 5, contactY);
  
  addText(data.personalInfo.location, contactX, contactY);

  yPosition = 70;

  // Professional Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(primaryColor);
  addText('Professional Summary', margin, yPosition);
  yPosition += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(textColor);
  const summaryLines = doc.splitTextToSize(data.summary, pageWidth - 2 * margin);
  summaryLines.forEach((line: string) => {
    addText(line, margin, yPosition);
    yPosition += lineHeight;
  });
  yPosition += 5;

  // Experience
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(primaryColor);
  addText('Professional Experience', margin, yPosition);
  yPosition += 10;

  data.experience.forEach((exp, index) => {
    checkPageBreak(40);
    
    // Company and position
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(textColor);
    addText(exp.position, margin, yPosition);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(lightGray);
    addText(` at ${exp.company}`, margin + doc.getTextWidth(exp.position), yPosition);
    
    // Duration
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    addText(exp.duration, pageWidth - margin - doc.getTextWidth(exp.duration), yPosition);
    yPosition += 7;

    // Description
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(textColor);
    const descLines = doc.splitTextToSize(exp.description, pageWidth - 2 * margin - 10);
    descLines.forEach((line: string) => {
      addText(line, margin + 5, yPosition);
      yPosition += lineHeight;
    });

    // Achievements
    if (exp.achievements && exp.achievements.length > 0) {
      yPosition += 2;
      exp.achievements.forEach((achievement) => {
        checkPageBreak(lineHeight);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        addText('•', margin + 5, yPosition);
        const achLines = doc.splitTextToSize(achievement, pageWidth - 2 * margin - 15);
        achLines.forEach((line: string, lineIndex: number) => {
          addText(line, margin + 10, yPosition + (lineIndex * lineHeight));
        });
        yPosition += achLines.length * lineHeight;
      });
    }
    
    yPosition += 8;
  });

  // Education
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(primaryColor);
  addText('Education', margin, yPosition);
  yPosition += 10;

  data.education.forEach((edu) => {
    checkPageBreak(20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(textColor);
    addText(edu.degree, margin, yPosition);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(lightGray);
    addText(edu.institution, margin, yPosition + 6);
    
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    addText(edu.year, pageWidth - margin - doc.getTextWidth(edu.year), yPosition);
    
    yPosition += 12;
    
    if (edu.details) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(textColor);
      const detailLines = doc.splitTextToSize(edu.details, pageWidth - 2 * margin - 10);
      detailLines.forEach((line: string) => {
        addText(line, margin + 5, yPosition);
        yPosition += lineHeight;
      });
      yPosition += 3;
    }
  });

  // Skills
  checkPageBreak(40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(primaryColor);
  addText('Skills', margin, yPosition);
  yPosition += 10;

  // Technical Skills
  if (data.skills.technical.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(textColor);
    addText('Technical:', margin, yPosition);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const techSkills = data.skills.technical.join(' • ');
    const techLines = doc.splitTextToSize(techSkills, pageWidth - 2 * margin - 50);
    techLines.forEach((line: string, index: number) => {
      addText(line, margin + 50, yPosition + (index * lineHeight));
    });
    yPosition += techLines.length * lineHeight + 5;
  }

  // Soft Skills
  if (data.skills.soft.length > 0) {
    checkPageBreak(15);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(textColor);
    addText('Soft Skills:', margin, yPosition);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const softSkills = data.skills.soft.join(' • ');
    const softLines = doc.splitTextToSize(softSkills, pageWidth - 2 * margin - 50);
    softLines.forEach((line: string, index: number) => {
      addText(line, margin + 50, yPosition + (index * lineHeight));
    });
    yPosition += softLines.length * lineHeight + 5;
  }

  // Languages
  if (data.skills.languages && data.skills.languages.length > 0) {
    checkPageBreak(15);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(textColor);
    addText('Languages:', margin, yPosition);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const languages = data.skills.languages.join(' • ');
    addText(languages, margin + 50, yPosition);
    yPosition += lineHeight + 5;
  }

  // Certifications
  if (data.certifications && data.certifications.length > 0) {
    checkPageBreak(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(primaryColor);
    addText('Certifications', margin, yPosition);
    yPosition += 10;

    data.certifications.forEach((cert) => {
      checkPageBreak(15);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(textColor);
      addText(cert.name, margin, yPosition);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(lightGray);
      addText(`${cert.issuer} - ${cert.year}`, margin, yPosition + 5);
      yPosition += 12;
    });
  }

  // Footer
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(lightGray);
  const footerText = `Generated on ${new Date().toLocaleDateString()}`;
  addText(footerText, pageWidth / 2 - doc.getTextWidth(footerText) / 2, pageHeight - 10);

  return doc.output('blob');
}

export function generateMockCVData(): CVData {
  return {
    personalInfo: {
      name: "John Doe",
      title: "Senior Software Engineer",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA"
    },
    summary: "Experienced software engineer with 8+ years of expertise in full-stack development, specializing in React, TypeScript, and Node.js. Proven track record of leading teams and delivering scalable solutions that drive business growth. Passionate about clean code, best practices, and mentoring junior developers.",
    experience: [
      {
        company: "Tech Innovations Inc.",
        position: "Senior Software Engineer",
        duration: "2020 - Present",
        description: "Lead development of microservices architecture serving 2M+ users. Mentor team of 5 engineers and drive technical decisions.",
        achievements: [
          "Improved system performance by 40% through optimization and caching strategies",
          "Led migration from monolith to microservices, reducing deployment time by 60%",
          "Implemented CI/CD pipeline that reduced bugs in production by 35%"
        ]
      },
      {
        company: "Digital Solutions Corp",
        position: "Full Stack Developer",
        duration: "2017 - 2020",
        description: "Developed and maintained e-commerce platform handling $10M+ in annual transactions.",
        achievements: [
          "Built real-time inventory management system using WebSockets",
          "Reduced page load time by 50% through code splitting and lazy loading",
          "Implemented automated testing suite with 85% code coverage"
        ]
      }
    ],
    education: [
      {
        institution: "University of California, Berkeley",
        degree: "Bachelor of Science in Computer Science",
        year: "2016",
        details: "Graduated with honors, GPA: 3.8/4.0. Relevant coursework: Data Structures, Algorithms, Software Engineering, Machine Learning"
      }
    ],
    skills: {
      technical: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker", "PostgreSQL", "MongoDB", "GraphQL", "REST APIs"],
      soft: ["Team Leadership", "Agile/Scrum", "Problem Solving", "Communication", "Mentoring"],
      languages: ["English (Native)", "Spanish (Fluent)", "Portuguese (Conversational)"]
    },
    certifications: [
      {
        name: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        year: "2022"
      },
      {
        name: "Certified Scrum Master",
        issuer: "Scrum Alliance",
        year: "2021"
      }
    ]
  };
} 