import re

def clean_math_to_unicode(latex_str: str) -> str:
    """
    Converts raw LaTeX math expressions into clean, elegant, human-readable mathematical typography.
    """
    s = latex_str.strip()
    
    # Remove outer $$ or $
    if s.startswith('$$') and s.endswith('$$'):
        s = s[2:-2].strip()
    elif s.startswith('$') and s.endswith('$'):
        s = s[1:-1].strip()
        
    # Replace common LaTeX symbols with Unicode math
    replacements = [
        (r'\\mathcal\{L\}', 'ℒ'),
        (r'\\mathcal\{M\}', 'ℳ'),
        (r'\\mathcal\{D\}', '𝒟'),
        (r'\\mathcal\{Q\}', '𝒬'),
        (r'\\mathcal\{R\}', 'ℛ'),
        (r'\\mathbb\{R\}', 'ℝ'),
        (r'\\mathbb\{I\}', '𝕀'),
        (r'\\mathbf\{1\}', '𝟏'),
        (r'\\nabla_w', '∇_w'),
        (r'\\nabla_b', '∇_b'),
        (r'\\nabla', '∇'),
        (r'\\epsilon', 'ε'),
        (r'\\delta', 'δ'),
        (r'\\alpha', 'α'),
        (r'\\lambda', 'λ'),
        (r'\\sigma', 'σ'),
        (r'\\beta', 'β'),
        (r'\\Phi', 'Φ'),
        (r'\\Delta_S', 'Δ_S'),
        (r'\\Delta', 'Δ'),
        (r'\\sum_\{i=1\}\^\{n_k\}', '∑(i=1 to n_k)'),
        (r'\\sum_\{j=1\}\^K', '∑(j=1 to K)'),
        (r'\\sum_\{k=1\}\^K', '∑(k=1 to K)'),
        (r'\\sum_\{t=1\}\^T', '∑(t=1 to T)'),
        (r'\\sum', '∑'),
        (r'\\in', '∈'),
        (r'\\ge', '≥'),
        (r'\\le', '≤'),
        (r'\\approx', '≈'),
        (r'\\times', '×'),
        (r'\\cdot', '·'),
        (r'\\odot', '⊙'),
        (r'\\to', '→'),
        (r'\\top', 'ᵀ'),
        (r'\\|', '‖'),
        (r'\\text\{clip\}', 'clip'),
        (r'\\text\{pos\}', 'pos'),
        (r'\\text\{weight\}', 'weight'),
        (r'\\text\{neg\}', 'neg'),
        (r'\\text\{global\}', 'global'),
        (r'\\text\{local\}', 'local'),
        (r'\\text\{trained\}', 'trained'),
        (r'\\text\{pop\}', 'pop'),
        (r'\\text\{step\}', 'step'),
        (r'\\text\{total\}', 'total'),
        (r'\\text\{otherwise\}', 'otherwise'),
        (r'\\text\{if \}', 'if '),
        (r'\\text\{Laplace\}', 'Laplace'),
        (r'\\text\{PRS\}', 'PRS'),
        (r'\\text\{Power\}', 'Power'),
        (r'\\text\{Percentile\}', 'Percentile'),
        (r'\\text\{Sensitivity\}', 'Sensitivity'),
        (r'\\text\{Specificity\}', 'Specificity'),
        (r'\\text\{Balanced Accuracy\}', 'Balanced Accuracy'),
        (r'\\ln', 'ln'),
        (r'\\min', 'min'),
        (r'\\max', 'max'),
        (r'\\left\(', '('),
        (r'\\right\)', ')'),
        (r'\\left\[', '['),
        (r'\\right\]', ']'),
        (r'\\left\\\{', '{'),
        (r'\\right\\\}', '}'),
        (r'\\{', '{'),
        (r'\\}', '}'),
    ]
    
    for pattern, repl in replacements:
        s = re.sub(pattern, repl, s)
        
    # Replace fractions: \frac{a}{b} -> (a / b)
    def repl_frac(m):
        num = m.group(1).strip()
        den = m.group(2).strip()
        return f"({num} / {den})"
        
    for _ in range(4): # Handle nested fractions
        s = re.sub(r'\\frac\{([^{}]+)\}\{([^{}]+)\}', repl_frac, s)
        
    # Clean subscripts & superscripts
    s = s.replace('^{(t+1)}', 'ᵗ⁺¹')
    s = s.replace('^{(t)}', 'ᵗ')
    s = s.replace('^{(T)}', 'ᵀ')
    s = s.replace('^{(k)}', 'ᵏ')
    s = s.replace('_k', 'ₖ')
    s = s.replace('_i', 'ᵢ')
    s = s.replace('_j', 'ⱼ')
    s = s.replace('^2', '²')
    s = s.replace('_2^2', '₂²')
    
    # Remove remaining backslashes
    s = s.replace('\\', '')
    
    return s.strip()

if __name__ == "__main__":
    test_eq1 = r"$$\mathcal{L}_k(w, b) = -\frac{1}{n_k} \sum_{i=1}^{n_k} \left[ w_{\text{pos}}^{(k)} \cdot y_i \ln \sigma(z_i) + (1 - y_i) \ln(1 - \sigma(z_i)) \right] + \frac{\lambda}{2} \|w\|_2^2$$"
    test_eq2 = r"$$\epsilon(\delta) = \min_{\alpha > 1} \left[ \mathcal{D}_\alpha^{(T)} + \frac{\ln(1/\delta)}{\alpha - 1} \right]$$"
    print("Equation 1:", clean_math_to_unicode(test_eq1))
    print("Equation 2:", clean_math_to_unicode(test_eq2))
