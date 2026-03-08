// ============================================================
//  Pro Resume Builder — script.js
//  AUTO-FIT: Always 1 page, smart scaling
// ============================================================

const STEPS = ["Purpose","Personal","Profile","Education","Skills","Experience"];
let step = 0;
let userPhoto = null;

const LEVEL_OPTIONS = {
  "College / Internship": ["1st Year Student","2nd Year Student","3rd Year Student","Final Year Student","Recently Graduated"],
  "Fresher Job":          ["0 Experience (Fresher)","Internship Experience Only","Less than 6 Months","6 Months – 1 Year"],
  "Campus Placement":     ["Final Year Student","Recently Graduated","1 Year Experience","2 Years Experience"],
  "Professional Job":     ["1–2 Years Experience","2–3 Years Experience","3–5 Years Experience","5+ Years Experience"]
};

function updateLevelOptions() {
  var purposeEl = document.querySelector('input[name="purpose"]:checked');
  var purpose   = purposeEl ? purposeEl.value : "College / Internship";
  var select    = document.getElementById("level");
  var options   = LEVEL_OPTIONS[purpose] || LEVEL_OPTIONS["College / Internship"];
  select.innerHTML = "";
  options.forEach(function(opt) {
    var o = document.createElement("option");
    o.value = opt; o.textContent = opt;
    select.appendChild(o);
  });
}

function renderProg(active) {
  var bar = document.getElementById("prog");
  bar.innerHTML = "";
  STEPS.forEach(function(s, i) {
    var d = document.createElement("div");
    d.className = "dot " + (i < active ? "done" : i === active ? "active" : "todo");
    d.textContent = i < active ? "✓" : i + 1;
    bar.appendChild(d);
    if (i < STEPS.length - 1) {
      var l = document.createElement("div");
      l.className = "pline " + (i < active ? "done" : "");
      bar.appendChild(l);
    }
  });
}

function showPanel(id) {
  document.querySelectorAll(".panel").forEach(function(p){ p.classList.remove("active"); });
  var el = document.getElementById(id);
  if (el) el.classList.add("active");
}

function next() { step++; renderProg(step); showPanel("p"+step); window.scrollTo(0,0); }
function back() { step--; renderProg(step); showPanel("p"+step); window.scrollTo(0,0); }

function val(id) {
  var el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function previewPhoto(event) {
  var file = event.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    userPhoto = e.target.result;
    document.getElementById("photoPreview").innerHTML = '<img src="'+e.target.result+'" alt="Photo"/>';
  };
  reader.readAsDataURL(file);
}

function ci(icon, text) {
  return '<div class="r-ci"><span class="r-ci-icon">'+icon+'</span><span>'+text+'</span></div>';
}

// ════════════════════════════
//  BUILD RESUME
// ════════════════════════════
function buildResume() {
  if (!val("name") || !val("email")) {
    alert("Please fill in your Name and Email first!");
    return;
  }

  // PHOTO
  var rPhoto = document.getElementById("rPhoto");
  rPhoto.innerHTML = userPhoto
    ? '<img src="'+userPhoto+'" alt="Profile"/>'
    : '<span style="font-size:60px">👤</span>';

  document.getElementById("rName").textContent = val("name").toUpperCase();
  document.getElementById("rRole").textContent = (val("jobTitle")||val("jobRole")||"").toUpperCase();

  // CONTACT
  var ch = "";
  if (val("location"))  ch += ci("📍", val("location"));
  if (val("phone"))     ch += ci("📞", val("phone"));
  if (val("email"))     ch += ci("✉️", val("email"));
  if (val("linkedin"))  ch += ci("🔗", val("linkedin"));
  if (val("coursera"))  ch += ci("🎓", val("coursera"));
  document.getElementById("rContact").innerHTML = ch || ci("✉️","—");

  // EDUCATION
  var eh = "";
  if (val("gradYear") || val("college")) {
    eh += '<div class="r-edu">';
    if (val("gradYear")) eh += '<div class="r-edu-year">'+val("gradYear")+'</div>';
    if (val("college"))  eh += '<div class="r-edu-institution">'+val("college")+'</div>';
    if (val("degree"))   eh += '<div class="r-edu-degree">'+val("degree")+'</div>';
    if (val("gpa"))      eh += '<div class="r-edu-sub">'+val("gpa")+'</div>';
    eh += '</div>';
  }
  if (val("pct12") || val("year12")) {
    eh += '<div class="r-edu"><div class="r-edu-detail">Class XII</div>';
    var d12 = [val("year12"), val("pct12")].filter(Boolean).join(" - ");
    if (d12)             eh += '<div class="r-edu-sub">'+d12+'</div>';
    if (val("school12")) eh += '<div class="r-edu-sub">From '+val("school12")+'</div>';
    eh += '</div>';
  }
  if (val("pct10") || val("year10")) {
    eh += '<div class="r-edu"><div class="r-edu-detail">Class X</div>';
    var d10 = [val("year10"), val("pct10")].filter(Boolean).join(" - ");
    if (d10)             eh += '<div class="r-edu-sub">'+d10+'</div>';
    if (val("school10")) eh += '<div class="r-edu-sub">From '+val("school10")+'</div>';
    eh += '</div>';
  }
  document.getElementById("rEdu").innerHTML = eh || '<p style="font-size:12px;color:#999">—</p>';

  // LANGUAGES
  var langH = "";
  if (val("languages")) {
    val("languages").split("\n").forEach(function(line) {
      line = line.trim(); if (!line) return;
      var parts = line.split(":");
      if (parts.length >= 2) {
        langH += '<div class="r-lang-item"><span class="r-lang-name">'+parts[0].trim()+':</span> <span class="r-lang-level">'+parts[1].trim()+'</span></div>';
      } else {
        langH += '<div class="r-lang-item"><span class="r-lang-name">'+line+'</span></div>';
      }
    });
  }
  var langSec = document.getElementById("rLangSec");
  if (langH) { document.getElementById("rLangs").innerHTML = langH; langSec.style.display="block"; }
  else langSec.style.display = "none";

  // HOBBIES
  var hobH = "";
  if (val("hobbies")) {
    val("hobbies").split(",").forEach(function(h) {
      h = h.trim(); if (h) hobH += '<span class="r-hobby-tag">'+h+'</span>';
    });
  }
  var hobbySec = document.getElementById("rHobbySec");
  if (hobH) { document.getElementById("rHobbies").innerHTML = hobH; hobbySec.style.display="block"; }
  else hobbySec.style.display = "none";

  // PROFILE
  document.getElementById("rProfile").textContent = val("profile") ||
    "A motivated and dedicated professional seeking opportunities to apply academic knowledge in a practical environment.";

  // TECHNICAL SKILLS
  var tsh = "";
  if (val("techSkills")) {
    val("techSkills").split(",").forEach(function(s) {
      s = s.trim(); if (s) tsh += "<li>"+s+"</li>";
    });
  }
  document.getElementById("rTechSkills").innerHTML = tsh || "<li>—</li>";

  // SOFT SKILLS
  var ssh = "";
  if (val("softSkills")) {
    val("softSkills").split(",").forEach(function(s) {
      s = s.trim(); if (s) ssh += "<li>"+s+"</li>";
    });
  }
  var softSec = document.getElementById("rSoftSec");
  if (ssh) { document.getElementById("rSoftSkills").innerHTML = ssh; softSec.style.display="block"; }
  else softSec.style.display = "none";

  // CERTIFICATIONS
  var certH = "";
  if (val("certs")) {
    val("certs").split("\n").forEach(function(c) {
      c = c.trim(); if (c) certH += "<li>"+c+"</li>";
    });
  }
  var certSec = document.getElementById("rCertSec");
  if (certH) { document.getElementById("rCerts").innerHTML = certH; certSec.style.display="block"; }
  else certSec.style.display = "none";

  // EXPERIENCE
  var expH = "";
  if (val("experience")) {
    val("experience").split("\n\n").forEach(function(block) {
      block = block.trim(); if (!block) return;
      var lines = block.split("\n");
      var first = lines[0]||"";
      var m = first.match(/^(.+?)\s+at\s+(.+?)\s*[\(（](.+?)[\)）]/i);
      expH += '<div class="r-exp-entry">';
      if (m) {
        expH += '<div class="r-exp-header"><span class="r-exp-title">'+m[1]+'</span><span class="r-exp-date">'+m[3]+'</span></div>';
        expH += '<div class="r-exp-co">'+m[2]+'</div>';
      } else {
        expH += '<div class="r-exp-title">'+first+'</div>';
      }
      expH += '<ul class="r-exp-pts">';
      lines.slice(1).forEach(function(l) {
        l = l.trim().replace(/^[-•]\s*/,""); if (l) expH += "<li>"+l+"</li>";
      });
      expH += '</ul></div>';
    });
  }
  var expSec = document.getElementById("rExpSec");
  if (expH) { document.getElementById("rExp").innerHTML = expH; expSec.style.display="block"; }
  else expSec.style.display = "none";

  // PROJECTS
  var projH = "";
  if (val("projects")) {
    val("projects").split("\n").forEach(function(l) {
      l = l.trim().replace(/^[-•\d.]\s*/,""); if (!l) return;
      var parts = l.split(":");
      projH += "<li>";
      if (parts.length >= 2) {
        projH += "<strong>"+parts[0].trim()+":</strong> "+parts.slice(1).join(":").trim();
      } else { projH += l; }
      projH += "</li>";
    });
  }
  var projSec = document.getElementById("rProjSec");
  if (projH) { document.getElementById("rProj").innerHTML = projH; projSec.style.display="block"; }
  else projSec.style.display = "none";

  // ACHIEVEMENTS
  var achH = "";
  if (val("achievements")) {
    val("achievements").split("\n").forEach(function(l) {
      l = l.trim().replace(/^[-•\d.]\s*/,""); if (l) achH += "<li>"+l+"</li>";
    });
  }
  var achSec = document.getElementById("rAchSec");
  if (achH) { document.getElementById("rAch").innerHTML = achH; achSec.style.display="block"; }
  else achSec.style.display = "none";

  // SHOW RESUME
  document.getElementById("formView").style.display   = "none";
  document.getElementById("resumeView").style.display = "block";
  window.scrollTo(0,0);

  // AUTO-FIT to 1 page after render
  setTimeout(autoFitResume, 100);
}

// ════════════════════════════
//  AUTO-FIT MAGIC
//  Scales resume content to always fit 1 page
// ════════════════════════════
function autoFitResume() {
  var resume  = document.getElementById("resume");
  var rBody   = resume.querySelector(".r-body");
  var rRight  = resume.querySelector(".r-right");
  var rLeft   = resume.querySelector(".r-left");

  // Target height = A4 = 1123px
  var TARGET  = 1123;

  // Reset any previous scaling first
  rRight.style.fontSize  = "";
  rLeft.style.fontSize   = "";
  rBody.style.gap        = "";

  // Remove previous spacing tweaks
  resume.querySelectorAll(".r-msec").forEach(function(el){ el.style.marginBottom = ""; });
  resume.querySelectorAll(".r-blist").forEach(function(el){ el.style.gap = ""; });
  resume.querySelectorAll(".r-nlist").forEach(function(el){ el.style.gap = ""; });
  resume.querySelectorAll(".r-contacts").forEach(function(el){ el.style.gap = ""; });
  resume.querySelectorAll(".r-edus").forEach(function(el){ el.style.gap = ""; });
  resume.querySelectorAll(".r-lsec").forEach(function(el){ el.style.marginBottom = ""; });
  resume.querySelectorAll(".r-exp-entry").forEach(function(el){ el.style.marginBottom = ""; });
  resume.querySelectorAll(".r-profile-text").forEach(function(el){ el.style.lineHeight = ""; });
  resume.querySelectorAll(".r-lang-list").forEach(function(el){ el.style.gap = ""; });

  var currentH = resume.scrollHeight;

  if (currentH <= TARGET) {
    // ── CONTENT TOO LITTLE → spread it out nicely ──
    var extra = TARGET - currentH;
    // Add breathing room to sections
    var msecs = resume.querySelectorAll(".r-msec");
    var addPerSection = Math.min(Math.floor(extra / (msecs.length + 1)), 14);
    msecs.forEach(function(el){ el.style.marginBottom = (20 + addPerSection) + "px"; });

    // Increase line heights slightly
    resume.querySelectorAll(".r-profile-text").forEach(function(el){
      el.style.lineHeight = "2.0";
    });
    resume.querySelectorAll(".r-blist").forEach(function(el){ el.style.gap = "10px"; });
    resume.querySelectorAll(".r-nlist").forEach(function(el){ el.style.gap = "9px"; });
    resume.querySelectorAll(".r-contacts").forEach(function(el){ el.style.gap = "12px"; });
    resume.querySelectorAll(".r-edus").forEach(function(el){ el.style.gap = "16px"; });
    resume.querySelectorAll(".r-lsec").forEach(function(el){ el.style.marginBottom = "26px"; });
    resume.querySelectorAll(".r-lang-list").forEach(function(el){ el.style.gap = "10px"; });

  } else {
    // ── CONTENT TOO MUCH → shrink smartly ──
    // Step 1: Reduce spacing first
    resume.querySelectorAll(".r-msec").forEach(function(el){ el.style.marginBottom = "12px"; });
    resume.querySelectorAll(".r-blist").forEach(function(el){ el.style.gap = "5px"; });
    resume.querySelectorAll(".r-nlist").forEach(function(el){ el.style.gap = "4px"; });
    resume.querySelectorAll(".r-contacts").forEach(function(el){ el.style.gap = "7px"; });
    resume.querySelectorAll(".r-edus").forEach(function(el){ el.style.gap = "9px"; });
    resume.querySelectorAll(".r-lsec").forEach(function(el){ el.style.marginBottom = "16px"; });
    resume.querySelectorAll(".r-exp-entry").forEach(function(el){ el.style.marginBottom = "9px"; });
    resume.querySelectorAll(".r-profile-text").forEach(function(el){ el.style.lineHeight = "1.6"; });
    resume.querySelectorAll(".r-lang-list").forEach(function(el){ el.style.gap = "5px"; });

    // Step 2: Check again after spacing reduction
    currentH = resume.scrollHeight;

    if (currentH > TARGET) {
      // Step 3: Reduce font size on right side
      var ratio    = TARGET / currentH;
      // Clamp: never go below 10px effective font
      var newSize  = Math.max(10.5, Math.round(13.5 * ratio * 10) / 10);
      rRight.style.fontSize = newSize + "px";
      rLeft.style.fontSize  = Math.max(10, Math.round(13 * ratio * 10) / 10) + "px";

      // Step 4: If still overflowing, reduce spacing more aggressively
      currentH = resume.scrollHeight;
      if (currentH > TARGET) {
        resume.querySelectorAll(".r-msec").forEach(function(el){ el.style.marginBottom = "8px"; });
        resume.querySelectorAll(".r-lsec").forEach(function(el){ el.style.marginBottom = "12px"; });
        resume.querySelectorAll(".r-blist").forEach(function(el){ el.style.gap = "3px"; });
        resume.querySelectorAll(".r-nlist").forEach(function(el){ el.style.gap = "3px"; });
        resume.querySelectorAll(".r-exp-entry").forEach(function(el){ el.style.marginBottom = "6px"; });
      }
    }
  }

  // Final: Always lock the resume height to exactly A4
  resume.style.minHeight = TARGET + "px";
  resume.style.height    = TARGET + "px";
  resume.style.overflow  = "hidden";
}

// ════════════════════════════
//  DOWNLOAD PDF — 1 page exact
// ════════════════════════════
async function downloadPDF() {
  var resume = document.getElementById("resume");
  var btn    = document.getElementById("pdfBtn");
  btn.textContent = "⏳ Creating PDF...";
  btn.disabled    = true;

  try {
    // Ensure auto-fit is applied before capturing
    autoFitResume();
    await new Promise(function(r){ setTimeout(r, 200); });

    var canvas = await html2canvas(resume, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      imageTimeout: 0,
      height: 1123,        // exactly A4 height in px
      windowHeight: 1123
    });

    var { jsPDF } = window.jspdf;
    var pdf = new jsPDF("p","mm","a4");
    var pW  = pdf.internal.pageSize.getWidth();   // 210mm
    var pH  = pdf.internal.pageSize.getHeight();  // 297mm
    var img = canvas.toDataURL("image/jpeg", 0.97);

    // Always fit to exactly 1 A4 page
    pdf.addImage(img, "JPEG", 0, 0, pW, pH);

    pdf.save((val("name")||"Resume").replace(/ /g,"_")+"_Resume.pdf");
    btn.textContent = "✅ Downloaded!";
    setTimeout(function(){ btn.textContent="⬇️ Download PDF"; btn.disabled=false; }, 3000);

  } catch(err) {
    alert("PDF Error: "+err.message);
    btn.textContent = "⬇️ Download PDF";
    btn.disabled    = false;
  }
}

// ════════════════════════════
//  RESTART
// ════════════════════════════
function restart() {
  step = 0; userPhoto = null;
  renderProg(0);
  document.querySelectorAll("input:not([type=radio]),textarea,select").forEach(function(el){
    el.value = el.tagName==="SELECT" ? el.options[0].value : "";
  });
  var r = document.querySelector('input[name="purpose"]');
  if (r) r.checked = true;
  var prev = document.getElementById("photoPreview");
  if (prev) prev.innerHTML = '<div class="photo-ph"><span>📷</span><span>Upload Photo</span></div>';
  document.getElementById("formView").style.display   = "block";
  document.getElementById("resumeView").style.display = "none";
  var resume = document.getElementById("resume");
  resume.style.height = "";
  resume.style.minHeight = "";
  resume.style.overflow = "";
  updateLevelOptions();
  showPanel("p0");
  window.scrollTo(0,0);
}

// ── INIT ──
renderProg(0);
updateLevelOptions();