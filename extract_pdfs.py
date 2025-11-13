import PyPDF2
import os

docs_path = r"d:\SPIT\5th Sem\Project\TMS\Documentations"
output_path = r"d:\SPIT\5th Sem\Project\TMS\Documentations\extracted"

os.makedirs(output_path, exist_ok=True)

pdf_files = [
    "Dev_SRS.pdf",
    "Dev_ClassDiagram.pdf",
    "Dev_UseCaseExp_TheatreMS.pdf",
    "Dev_Activity_Dig.pdf",
    "Dev_SeqAndCollab.pdf"
]

for pdf_file in pdf_files:
    pdf_path = os.path.join(docs_path, pdf_file)
    output_file = os.path.join(output_path, pdf_file.replace('.pdf', '.txt'))
    
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text += f"\n--- Page {page_num + 1} ---\n"
                text += page.extract_text()
            
            with open(output_file, 'w', encoding='utf-8') as output:
                output.write(text)
            
            print(f"✓ Extracted: {pdf_file} ({len(pdf_reader.pages)} pages)")
    except Exception as e:
        print(f"✗ Error with {pdf_file}: {str(e)}")

print("\nExtraction complete!")
