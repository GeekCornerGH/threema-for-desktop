# Releasing Threema For Desktop

First, commit your changes using Git. Just use <code>git commit -a</code>.  
You will need tag your changes like this: <code>git tag v(put here version from your package.json)</code>  
Finnally, push your changes: <code>git push && git push --tags</code> (for powershell users: <code>git push; git push --tags</code>)
GitHub Actions will handle the building, and you will now just have to publish the release.