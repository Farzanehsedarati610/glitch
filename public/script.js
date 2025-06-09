// public/script.js
document.addEventListener('DOMContentLoaded', () => {
    const transferButton = document.getElementById('transferButton');
    const responseOutput = document.getElementById('responseOutput');

    // !!! IMPORTANT: In a real application, retrieve this token securely (e.g., after user login),
    // and DO NOT hardcode it directly in client-side JavaScript for production.
    const AUTH_TOKEN = "eyJhdWRpZW5jZSI6WyJ1cm46Z2xpdGNoOmNsaWVudCJdLCJpc3N1ZXIiOiJodHRwczovL29wLmdsaXRjaC5jb20iLCJoZWFkZXIiOnsidHlwIjoiSldUIn0sImVuYyI6IkExMjhDQkMtSFMyNTYiLCJhbGciOiJQQkVTMi1IUzI1NitBMTI4S1ciLCJwMmMiOjI3NDAsInAycyI6IktCMnp3ZzRYSGNUZjNsNk1kZlRVUUEifQ.EdzZ7oh_yQnzi3QPK5ItICnF4pPkYnCv1vvOftN5XH33rBmMsgX5KA.GXK9APLjcG_dfILcivB6kQ.ofAZYdelFLpuu56Canva05bzLUbhFqrzeOCDS3PnZA-5fNeYwRKHxn59wJ3DKyBY2VfoqmNMwglGZyU7CWWPOXltI19DVZvzqEODnpGP0dCfykL9ZROCiG_4XXBYz6N.ybppHP2-FoMP9JsNKraIvA";

    const HASHES = [
        "20f586474bf292d420bb8c5139bfb8224cda900280ffa2c95b45a33eb98e96cd",
        "c1e586cecb4f643611e882c6b3638f2d51a7b6ccd4f647c305351fccde94b9b4",
        "7f1c56bf38070c1637e6b0ce91fe5ab1ab8474be6dab8be2a3bf8eadb771e062",
        "b818d555523674878848476ee8ffc99cff1c95529e3cc450511672922a4a5736",
        "3e153176e6fcf704b9ebdb6cce4818ea6f276bcb42d4db72d6207df3434f3344",
        "94e02b38274bfc81e66ea2e90f57f62faa2b5ae13e15bf89a3fc113881871e4e",
        "029ff25d832b97b9d55fc93078dac6552a61be7a",
        "7c7228137410dc76b4925dfcc729fdc92cfd94a026022111c1a502d6240580fb",
        "26efc86c0269a129bd183480f947c7424a48f9523156a8a70d3dfe5ed7103aab",
        "c6f44160cdd0479af696b81abdd1982d36e08263322e4c5b07bf27b5623b29d5",
        "d71d4b23cb2ec49e7b0ff31fd563b5ffdf4899dbecebd599711213ff37e52bd9",
        "3fc8241058ee913bfe277e4652abc04822b33aa939d6f65084aae02e917eeff1",
        "663e295cc4399e9a551571eebd7a4db0d6f3662c87eb18d0e0a2a4b67f07145c",
        "8470faf251f8c3c8672718cbd982f942ce649bb69714794eb8b1de934cb59d52",
        "dc5b25606dc0c977dec5aa13d61946b470066976aefcf390c40ffaff75d9a186",
        "a23b0d1d1e8a721623a1a85b64a353fface595030eb41ba33d8fe4a554ee59d5",
        "3842daf9315978e904e20579f52913aec3274e22b09c4fa9ddd2a2b7",
        "ca4ba96c58580a9d2ddbc99d993cf0a703c366c85f608a8d9d6b3890",
        "65a6745f084e7af17e1715ae9302cc14820e331af610badd3d9805cb9cd3504e",
       ];
    const TRANSFER_AMOUNT = 20000000; // Twenty million (numeric value)

    transferButton.addEventListener('click', async () => {
        responseOutput.textContent = 'Initiating transfers...';
        responseOutput.classList.remove('error', 'success');

        const results = [];
        let successCount = 0;
        let failCount = 0;

        // Disable button during processing
        transferButton.disabled = true;
        transferButton.textContent = 'Processing... Please wait.';

        for (const hash of HASHES) {
            try {
                const response = await fetch('/api/transfer', { // Now correctly routes to api/index.js via Vercel's rewrite
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${AUTH_TOKEN}`
                    },
                    body: JSON.stringify({
                        hash: hash,
                        amount: TRANSFER_AMOUNT
                    })
                });

                const data = await response.json(); // Always try to parse JSON, even on error
                if (response.ok) { // Check for successful HTTP status (2xx)
                    results.push(`SUCCESS for hash ${hash}: ${JSON.stringify(data, null, 2)}`);
                    successCount++;
                } else {
                    results.push(`ERROR for hash ${hash} (Status: ${response.status}): ${JSON.stringify(data, null, 2)}`);
                    failCount++;
                }
            } catch (error) {
                // This catches network errors or issues with JSON parsing
                results.push(`NETWORK/PARSING ERROR for hash ${hash}: ${error.message}`);
                failCount++;
            }
        }

        // Re-enable button after processing
        transferButton.disabled = false;
        transferButton.textContent = 'Trigger Simulated Transfers';

        responseOutput.textContent = `Completed ${HASHES.length} transfers.\nTotal Successes: ${successCount}\nTotal Failures: ${failCount}\n\n--- Individual Results ---\n\n` + results.join('\n\n');

        if (failCount === 0 && successCount > 0) {
            responseOutput.classList.add('success');
        } else if (successCount > 0 && failCount > 0) {
            responseOutput.classList.add('warning'); // You might need to define .warning in CSS
            responseOutput.style.color = 'orange'; // Temporary style if .warning not defined
        } else {
            responseOutput.classList.add('error');
        }
    });
});
