Dear Applicant,

We at Goldenset are pleased to inform you that you have made it to the second round of our Intern to Hire program.

In this round we are asking you to complete the following project by October 17th, 5PM PST (all dates and times are based on USA, California).

For transparency you are competing with other 29 applicants who are also interested in an UI intern position in Goldenset.

We process the home assignments and schedule interviews based on the timestamp of receiving your code.

Your code must be complete and meet all the requirements.

**UI Home assignment**

As an UI intern we are going to teach you the ins and outs of JavaScript, HTML, CSS, React, Next.js and much more.

In order to do that you must know the basics of the web development environment and based on your resume you have some experience in this area.

**The Project**

- Open an account in https://codesandbox.io/ to develop your code
- Implement registration form for "user" entity
    - The code must be written in React and with Typescript
    - For UI framework you can use Next.js
    - All components should be develop from scratch and no component library is allowed
    - User entity has the following fields
        - First Name
        - Last Name
        - Email
        - Password
    - All validations are on client side
        - All fields are required
        - Email could only be Gmail, no other providers are accepted
        - The email address of "[test@gmail.com](mailto:test@gmail.com)" must be consider already registered and the uniqueness validation must fail for it
        - Password must be between 8 and 30 character, having at least one lower case, one upper case, one number, and one special character
    - The registration form must have the followings states
        - Ideal state when it's load
        - Warning, Failure and Success states according to web standards
- Add unit tests
- Add README.md and explain
    - Your approach to solving the problem
    - How much AI did you use?
    - In your opinion, where are the places you could do better?
- Send the codesandbox link to your complete and working code to [kia@goldenset.com](mailto:kia@goldenset.com)
    - Email's subject should follow this format "SOT:UI:__YOUR_NAME__"

**How do we test your code**

- Your sandbox code should run successfully with push of a button
- Your tests runs successfully and if we change any line of codes, the corresponding tests are expected to fail
    - In the case of changing the code and no tests failing, we consider it in-complete project
- We test the form validations and states by giving it different values

**FYI**

- If/when you make it to next round, we ask you to add more functionality to the same code during interview

**Extra Credit**

- Develop a simple API using Node.js
- Save form data in postgresQL
- Add basic unit tests for API code

## ⚠️ Important Notes

### 1. Environment & Compatibility

- **Do not rely on local environment variables or absolute file paths.**
    
    The reviewers will only run your code inside [CodeSandbox](https://codesandbox.io/).
    
    Your project must build and run successfully **entirely within that environment** without any manual configuration.
    
- **All required dependencies must be listed in `package.json`.**
    
    Missing dependencies that prevent successful builds will be treated as incomplete submissions.
    
- **Avoid OS-specific commands or scripts.** Use cross-platform commands (`npm`, `yarn`, `pnpm`) and ensure the app runs with one click on CodeSandbox.
- The project must launch correctly when pressing the **“Run”** button — no additional setup should be required.

---

### 2. Project Structure & Code Quality

- Follow standard **Next.js + TypeScript** conventions and best practices.
- **No component libraries** (e.g., MUI, Chakra UI, AntD) are allowed — all components must be custom-built.
- Maintain a clean and logical folder structure:
    
    ```
    components/
    pages/
    hooks/
    utils/
    tests/
    
    ```
    
- Keep your code **readable, modular, and well-commented.**
- Use proper **TypeScript typings** — avoid `any` unless absolutely necessary.
- Maintain consistent **code formatting** (e.g., via Prettier or ESLint).

---

### 3. Git & Version Control

- Use **Git** properly throughout development to ensure a traceable and organized commit history.
- Follow these basic Git best practices:
    - Commit frequently — **after completing a feature, bug fix, or logical unit of work.**
    - Write **clear and descriptive commit messages** (e.g., `feat: add email validation`, `fix: password regex issue`).
    - Avoid committing large or unrelated changes together.
    - Do **not commit build artifacts** or dependencies (e.g., `node_modules`, `.next`, `dist`).
    - Use `.gitignore` to keep the repository clean.
    - Keep the `main` or `master` branch stable; use feature branches if needed.
- A well-structured Git history demonstrates professionalism and project management skills.

---

### 4. Testing Requirements

- Include **unit tests** for all core functions, especially validation logic.
- Tests must be **meaningful and fail when code changes.**
    - If all tests still pass after a line of code is modified, the project will be marked **incomplete**.
- Use frameworks such as **Jest** and **React Testing Library**.
- Document in the README how to run tests (`npm test` or `yarn test`).

---

### 5. Validation & Functional Requirements

- Implement all required **client-side validation**:
    - All fields are mandatory.
    - Email must be Gmail-only.
    - `test@gmail.com` should fail uniqueness validation.
    - Password: 8–30 characters, at least one lowercase, one uppercase, one number, and one special character.
- Implement and visually represent all UI states:
    - **Ideal** (initial)
    - **Warning**
    - **Failure**
    - **Success**
- Follow standard web UI/UX conventions: clear error messages, accessible labels, responsive design.

---

### 6. README.md Guidelines

Your `README.md` should include:

- Your **approach and reasoning** behind the implementation.
- **Setup and testing instructions**.
- A description of **how much AI assistance** you used (e.g., “Used Claude for regex pattern suggestion”).
- A section on **potential improvements** you would make with more time.
- Any **extra features** or technical decisions worth mentioning.

---

### 7. Extra Credit (Optional)

You can earn bonus points by:

- Creating a simple **Node.js API** that handles registration.
- Saving form data in a **PostgreSQL** database (or mock equivalent).
- Writing **basic backend tests** for API endpoints.

---

### 8. Submission Instructions

- Host the final working version on CodeSandbox.
- Ensure the sandbox runs successfully and all tests pass.
- Send the link via email to **kia@goldenset.com**.
- Email subject format:
    
    ```
    SOT:UI:Your_Name
    
    ```
    

---

### 9. Additional Tips

- Maintain consistent CSS organization (CSS Modules, plain CSS, or inline styles are acceptable).
- Ensure the layout is **responsive and accessible**.
- Keep console free of warnings and errors.
- Test thoroughly in multiple browsers or screen sizes if possible.
- Make sure every dependency and script is properly documented in `package.json`.