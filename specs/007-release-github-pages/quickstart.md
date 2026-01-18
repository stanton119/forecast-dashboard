# Quickstart Guide: Release Website on GitHub Pages

This guide outlines how to quickly get started with and verify the GitHub Pages deployment feature.

## Verification

To verify that the GitHub Pages deployment is working correctly:

1.  **Push to `main` branch**: Make a small, visible change to the project's codebase (e.g., update text in a `.astro` or `.jsx` file) and push it to the `main` branch of the GitHub repository.
    ```bash
    git checkout main
    # Make your changes
    git commit -am "Test: Verify GitHub Pages deployment"
    git push origin main
    ```
2.  **Monitor GitHub Actions**: Navigate to the "Actions" tab in your GitHub repository. You should see a workflow run triggered by your push to `main`.
3.  **Wait for Workflow Completion**: Allow the deployment workflow to complete. This typically involves building the project and deploying the static assets to the `gh-pages` branch.
4.  **Access GitHub Pages URL**: Once the workflow shows a successful completion, navigate to your GitHub Pages URL (usually `https://<YOUR_GITHUB_USERNAME>.github.io/<YOUR_REPOSITORY_NAME>/`).
5.  **Confirm Changes**: Verify that the changes you pushed in step 1 are now reflected on the live website.

## Initial Setup (Manual Step)

Before the automated deployment can work, ensure that GitHub Pages is correctly configured for your repository:

1.  In your GitHub repository, go to **Settings** > **Pages**.
2.  Under "Build and deployment", for "Source", select **Deploy from a branch**.
3.  For "Branch", select `gh-pages` and then select the `/ (root)` folder.
4.  Click **Save**.

This initial setup only needs to be done once per repository.
