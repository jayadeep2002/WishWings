import re
import os

filepath = r"d:\wishWings\client\src\pages\admin\AdminDashboard.jsx"

# Check if file exists before processing
if not os.path.exists(filepath):
    print(f"Error: File not found at {filepath}")
    exit(1)

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
modified = False

for i, line in enumerate(lines):
    # 1. KYC Button Replacement
    if 'Audit KYC' in line and '<a href={a.idProof}' in line:
        indent = line[:line.find('<a')]
        new_lines.append(indent + "{a.idProof ? (\n")
        new_lines.append(line)
        modified = True
        continue
    
    if modified and '</a>' in line and i > 0 and 'Audit KYC' in lines[i-1]:
        new_lines.append(line)
        indent = line[:line.find('</a>')]
        new_lines.append(indent + ") : (\n")
        new_lines.append(indent + '   <button onClick={() => toast.error("No ID Proof uploaded by partner")} className="flex items-center justify-center gap-2 border border-white/5 text-white/30 text-[10px] font-bold px-6 py-3 uppercase tracking-widest cursor-not-allowed">\n')
        new_lines.append(indent + "      No KYC Doc\n")
        new_lines.append(indent + "   </button>\n")
        new_lines.append(indent + ")}\n")
        modified = False
        continue

    # 2. Agent Assignment Replacement
    # Note: The target string here might not match if the file has already been modified by other tools.
    target_filter = 'agents.filter(a => a.isApproved && a.city?.toLowerCase() === selectedBooking.recipientCity?.toLowerCase())'
    if target_filter in line:
        indent = line[:line.find('{')]
        if '.length > 0 ? (' in line:
            new_lines.append(indent + "{agents.filter(a => {\n")
            new_lines.append(indent + "   const cityMatch = a.city?.toLowerCase().trim();\n")
            new_lines.append(indent + "   const targetCity = selectedBooking.recipientCity?.toLowerCase().trim();\n")
            new_lines.append(indent + "   return a.isApproved && (cityMatch && targetCity && (cityMatch.includes(targetCity) || targetCity.includes(cityMatch)));\n")
            new_lines.append(indent + "}).length > 0 ? (\n")
        elif '.map(agent => (' in line:
            new_lines.append(indent + "{agents.filter(a => {\n")
            new_lines.append(indent + "   const cityMatch = a.city?.toLowerCase().trim();\n")
            new_lines.append(indent + "   const targetCity = selectedBooking.recipientCity?.toLowerCase().trim();\n")
            new_lines.append(indent + "   return a.isApproved && (cityMatch && targetCity && (cityMatch.includes(targetCity) || targetCity.includes(cityMatch)));\n")
            new_lines.append(indent + "}).map(agent => (\n")
        continue

    new_lines.append(line)

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Replacement logic finished")
