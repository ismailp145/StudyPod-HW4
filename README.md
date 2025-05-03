# StudyPod

## Project Pitch

Thousands of students struggle daily to balance their studies, manage time, and absorb vast amounts of information. Our AI-powered podcast generator transforms articles and study notes into personalized, natural-sounding podcasts, making learning effortless and flexible. Podcasts are the new hype and represent a rapidly growing media format that people are increasingly consuming in their daily lives. With this mobile app, students can effortlessly turn study time into productive, enjoyable listening anywhere, anytime - tapping into the proven effectiveness of audio learning through convenient smartphone access that seamlessly integrates with their on-the-go lifestyle.

## Front End

We will use React Native with Expo and TypeScript to build a responsive mobile app that users can interact with. NativeBase will provide the UI components for consistent design across iOS and Android platforms.

## Back End

We will use MongoDB to store user information and podcast content, and deploy a Node.js server with Express to handle data transfer between the front end and the database. Gemini AI will process and transform text content into podcast scripts, while ElevenLabs/Play.ht API will generate natural and unique voices for the audio content.

## Functional Requirements

### User Features

1. Users should be able to sign up, log in/out, and reset their password, with optional
social login.

2. Users should be able to upload or import text content (articles, notes). It will convert
any text content into audio podcast format alongside a summary.

3. Users should be able to personalize audio settings (voice style, reading speed, etc.)

4. Users can manage a custom playlist of generated podcasts that they have saved.

5. Users should have access to recommended or trending content via a personalized
discovery feed.

### Non Functional Requirements

1. Performance: The website should load in under 3 seconds for 95% of users,
ensuring smooth navigation and score tracking even during peak usage times.

2. Security: User data, including login credentials and review information, must be encrypted using AES-256 encryption, with secure authentication mechanisms to protect user privacy.

3. Usability: The website should be mobile-friendly, with an intuitive interface that achieves a user satisfaction score of at least 80% in terms of ease of use and Navigation.

4. Scalability: The platform must support up to 50 active concurrently without significant slowdowns or issues.
