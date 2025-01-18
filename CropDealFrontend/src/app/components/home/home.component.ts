import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private textArray: string[] = [
    'Farmers sell their crops directly to dealers.',
    'Easy and fast crop trading.',
    'Transparent B2B marketplace for crops.',
    'Empowering farmers and dealers to connect.',
    'Buy crops directly from trusted farmers.'
  ];

  // The current text displayed in the typewriter
  public currentText: string = '';
  private currentIndex: number = 0;
  private currentCharIndex: number = 0;
  private typingInterval: any;

  ngOnInit() {
    this.startTypewriterEffect();
  }

  // Start the typewriter effect
  private startTypewriterEffect() {
    this.typingInterval = setInterval(() => {
      if (this.currentCharIndex < this.textArray[this.currentIndex].length) {
        this.currentText += this.textArray[this.currentIndex][this.currentCharIndex];
        this.currentCharIndex++;
      } else {
        clearInterval(this.typingInterval);
        setTimeout(() => {
          this.currentIndex = (this.currentIndex + 1) % this.textArray.length;
          this.currentCharIndex = 0;
          this.currentText = '';
          this.startTypewriterEffect(); // Restart for next text
        }, 1000);
      }
    }, 100); // Speed of typing
  }
}
