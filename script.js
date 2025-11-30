//#################################### FRONT-END ####################################
function back(){
    if(history.length > 1){
        history.back();
        return 0;
    }
}
const nav = document.getElementById('nav')
const icon = document.getElementById('icon');
window.addEventListener('scroll', () =>{
    if(window.scrollY > 100){
        icon.style.opacity = '1';
    }else{
        icon.style.opacity = '0';
    }
});
icon.addEventListener('click',() => {
    window.scrollTo({
        top:0,
        behavior: 'smooth'
    });
});
document.querySelectorAll("[data-scroll-nav]").forEach(navItem => {
    navItem.addEventListener("click", function() {
        let index = this.getAttribute("data-scroll-nav");
        let target = document.querySelector(`[data-scroll-index="${index}"]`);
        if (target) {
            window.scrollTo({
                top: target.offsetTop,
                behavior: "smooth"
            });
        }
    });
});
function cv(){
    window.open('images/profile.jpg');
}
const menuu = document.getElementById('menu');
function menu(){
    menuu.classList.add('open');
    document.body.style.overflowY = 'hidden';
}
function closefun(){
    menuu.classList.remove('open');
    document.body.style.overflowY = 'scroll';
}
const contact = document.getElementById('contact')
const about1 = document.getElementById('about1')
const about2 = document.getElementById('about2')
const about3 = document.getElementById('about3')
const services1 = document.getElementById('services1')
const services2 = document.getElementById('services2')
const services3 = document.getElementById('services3')
window.addEventListener('scroll',() =>{
    if(window.scrollY > 1778){
        contact.style.animationName = 'WebAnim';
        contact.style.animationDuration = '1.5s'
    }else{
        contact.style.animation = 'none';
    }
});
window.addEventListener('scroll',() =>{
    if(window.scrollY > 25){
        services1.style.animationName = 'WebAnim';
        services1.style.animationDuration = '1.7s';
        services2.style.animationName = 'WebAnim';
        services2.style.animationDuration = '1.7s';
        services3.style.animationName = 'WebAnim';
        services3.style.animationDuration = '1.7s';
    }else{
        services1.style.animation = 'none';
        services2.style.animation = 'none';
        services3.style.animation = 'none';
    }
});
window.addEventListener('scroll',() =>{
    if(window.scrollY > 773){
        about1.style.animationName = 'WebAnim';
        about1.style.animationDuration = '1.5s';
        about2.style.animationName = 'WebAnim';
        about2.style.animationDuration = '1.5s';
        about3.style.animationName = 'WebAnim';
        about3.style.animationDuration = '1.5s';
    }else{
        about1.style.animation = 'none';
        about2.style.animation = 'none';
        about3.style.animation = 'none';
    }
});
//#################################### BACK-END ####################################

const API_KEY = 'b46685c7b70d5860f54df9489026a63e83c1acb1501a76c0263508986d1cd68e';

const getElement = id => document.getElementById(id)

const updateResult = (content, display = true) => {
    const result = getElement('result');
    result.style.display = display ? 'block' : 'none'
    result.innerHTML = content;
};

const showLoading = message => updateResult(`
    
    <div class="loading">
        <p>${message}</p>
        <div class="spinner"></div> 
    </div>
    
    `);

const showError = message => updateResult(`<p class="error">${message}</p>`)


async function makeRequest(url,options={}) {
    const response = await fetch(url,{
        ...options,
        headers:{
            'x-apikey': API_KEY,
            ...options.headers
        }
    });
    if(!response.ok){
        const error = await response.json().catch(() => ({error: {message: response.statusText}}));
        throw new Error(error.error?.message || 'Request Failed');
    }
    return response.json;
}

async function scanURL() {
    const url = getElement('urlInput').value.trim();
    if (!url) return showError("Please Enter a URL");
    try{
        new URL(url);
    }catch{
        return showError('Please Enter a Valide URL (https://example.com)');
    }
    try{
        showLoading('Submitting URL for scanning ... ')
        const encodedUrl = encodeURIComponent(url);

        const submitResult = await makeRequest("https://www.virustotal.com/api/v3/urls" , {
            method: "POST",
            headers: {
                'accept': 'application/json',
                'content-type': 'application/x-www-form-url-encoded'
            },
            body: `url=${encodedUrl}`
        });
        if(!submitResult.data?.id){
            throw new  Error("Failed to get analysis ID")
        }
        await new Promise(resolve => setTimeout(resolve , 3000));
        showLoading("Getting scan Results ...");
        await pollAnalysisResults(submitResult.data.id)
    }catch (error){
        showError(`Error: ${error.message}`);
    }
}


async function scanFile() {
    const file = getElement('fileInput').files[0];
    if(!file) return showError('Please select a file !');
    if(file.length > 32 * 1024 * 1024) return showError('File size exceeds 32MB limit.');
    try{
        showLoading("Uploading file ...");
        const formData = new FormData();
        formData.append("file",file);
        const uploadResult = makeRequest("https://www.virustotal.com/api/v3/files" , {
            method: "POST",
            body: formData
        });
        if(!uploadResult.data?.id){
            throw new Error("Faild to get file ID");
        }
        await new Promise(resolve => setTimeout(resolve , 3000))
        showLoading("Getting Scan Results ...");
        const analysisResult = makeRequest(`https://www.virustotal.com/api/v3/analyses/${uploadResult.data.id}`);
        if(!analysisResult.data?.id){
            throw new Error("Failed to get Analysis Results");
        }
        await pollAnalysisResults(analysisResult.data.id , file.name)
    }catch(error){
        showError(`Error: ${error.message}`);
    }
}



async function pollAnalysisResults(analysisId, fileName="") {
    const maxAttempts = 20;
    let attempts = 0;
    let interval = 200;
    while (attempts < maxAttempts){
        try{
            showLoading(`Analyzing${fileName ? `${fileName}`: ''}... (${((maxAttempts-attempts)*interval/1000).topFixed(0)}s remaining)`);
            const report = await makeRequest(`https://www.virustotal.com/api/v3/analyses/${analysisId}`);
            const status = report.data?.attributes?.status;
            if(!status) throw new Error("Invalid analysis response");
            if(status === "completed"){
                showFormattedResult(report);
                break;
            }
            if(status === "failed"){
                throw new Error("Analysis Failed")
            }
            if(++attempts >= maxAttempts){
                throw new Error("Analysis timeout - please try again");
            }

            interval = Math.min(interval * 1.5, 8000);
            await new Promise(resolve => setTimeout(resolve,interval));
        }catch(error){
            showError(`Error: ${error.message}`);
            break;
        }
    }
}


function showFormattedResult(data){
    if(!data?.data?.attributes?.stats) return showError("Invalid Response Format !");
    const stats = data.data.attributes.stats;
    const total = Object.values(stats).reduce((sum,val) => sum + val, 0);
    if(!total) return showError("No Analysis Results available");
    const getPercent = val => ((val / total) * 100).toFixed(1);
    const categories = {
        malicious: { color: 'malicious', label: 'Malicious'},
        suspicious: { color: 'suspicious', label: 'Suspicious'},
        harmless: { color: 'safe', label: 'Safe'},
        undetected: { color: 'undetected', label: 'Undetected'},
    };
    const percents = Object.keys(categories).reduce((acc,key) => {
        acc[key] = getPercent(stats[key]);
        return acc;
    }, {});
    const verdict = stats.malicious > 0 ? "Malicious" : stats.suspicious > 0 ? "Suspicious" : "Safe";
    const verdictClass = stats.malicious > 0 ? "malicious" : stats.suspicious > 0 ? "suspicious" : "safe";
    updateResult(`
        <h3>Scan Report</h3>
        <div class="scan-stats">
            <p><strong>Verdict:</strong><span class="${verdictClass}">${verdict}</span></p>
            <div class="progress-section">
                <div class="progress-label">
                    <span>Detection Results</span>
                    <span class="progress-percent">${percents.malicious}% Detection Rate</span>
                </div>
                <div class="progress-stacked">
                    ${Object.entries(categories).map(([key,{color, label}]) => `
                        <div class="legend-item">
                        <div class="legend-color ${color}"><span>
                        <span>${label}(${percents[key]}%)</span>
                        </div>
                    `).join('')}
                </div>
            </div>  
            <div class="detection-details">
                ${Object.entries(categories).map(([key,{color, label}]) => `
                
                    <div class="detailed-item ${color}">
                        <span class="detailed-label">${label}</span>
                        <span class="detailed-value">${stats[key]}</span>
                        <span class="detailed-percent">${percents[key]}%</span>
                    </div>
                `).join("")}
            </div>  
        </div>    
        <button onclick="showFullReport(this.getAttributte('data-report'))" data-report='${JSON.stringify(data)}'>View Full Report
    `);
    setTimeout(() => getElement('result').querySelector('.progress-stacked').classList.add("animate"), 1000); 
}


function showFullReport(reportData){
    const data = typeof reportData === "string" ? JSON.parse(reportData) : reportData;
    const modal = getElement('fullReportModal');
    const result = data.data?.attributes?.results;
    getElement('fullReportContent').innerHTML = `
        <h3>Full Report Details</h3>
        ${result ? `
            <table>
                <tr><th>Engine</th><th>Result</th></tr>
                ${Object.entries(results).map(([engine, {category}]) => `
                    <tr>
                        <td>${engine}</td>
                        <td class="${category === "malicious" ? "malicious" : category === "suspicious" ? "suspicious" : "safe"}">${category}</td>
                    </tr>
                `).join('')}
            </table> 
        ` : '<p>No detailed results available</p>'}
    `;
    modal.style.display = 'block';
    modal.offsetHeight;
    modal.classList.add("show");
}


const closeModal = () => {
    const modal = getElement("fullReportModal");
    modal.classList.remove("show");
    setTimeout(() => modal.style.display = "none", 300);
}

window.addEventListener('load',() => {
    const modal = getElement('fullReportModal');
    window.addEventListener('click', e => e.target === modal && closeModal());
});
