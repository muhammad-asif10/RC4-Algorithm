# RC4 Algorithm: Interactive Visualization and Analysis

[![Website](https://img.shields.io/badge/Website-Visit_Live_Site-orange?style=for-the-badge&logo=firefox&logoColor=white)](https://muhammad-asif10.github.io/RC4-Algorithm/)


## Abstract

This repository presents an interactive web-based implementation and visualization of the RC4 (Rivest Cipher 4) stream cipher algorithm. RC4, originally designed by Ronald Rivest in 1987, is one of the most widely used stream ciphers in cryptographic applications. This project provides a comprehensive step-by-step visualization of the algorithm's internal state transitions, enabling researchers, students, and cybersecurity professionals to gain deeper insights into the mechanics of stream cipher cryptography. The implementation includes both encryption and decryption operations with real-time visualization of the Key-Scheduling Algorithm (KSA) and the Pseudo-Random Generation Algorithm (PRGA) phases.

---

## 1. Introduction

### 1.1 Background on RC4

RC4 is a symmetric stream cipher that generates a pseudorandom keystream from a variable-length secret key. Despite documented weaknesses discovered over the years, RC4 remains prevalent in legacy systems, SSL/TLS protocols, and various security applications. Understanding the internal mechanisms of RC4 is crucial for cryptanalysis, security auditing, and educational purposes.

### 1.2 Purpose

This project aims to provide:
- A **functional implementation** of the RC4 algorithm compliant with RFC 6234
- An **interactive visualization** of algorithm state transitions
- A **pedagogical tool** for understanding stream cipher fundamentals
- A **research platform** for analyzing cryptographic behavior

### 1.3 Scope

This repository includes:
- Complete JavaScript implementation of RC4 KSA and PRGA phases
- Web-based GUI with real-time S-Box state visualization
- Support for both text and hexadecimal input/output
- Adjustable execution speed for detailed analysis
- Comprehensive logging of intermediate values

---

## 2. Theoretical Foundation

### 2.1 Stream Cipher Fundamentals

A stream cipher operates by generating a pseudorandom keystream **K** from a secret key **k** and XORing it with plaintext **P** to produce ciphertext **C**:

```
C = P ⊕ K
```

The security of stream ciphers relies on the pseudorandomness of the keystream. If K is truly random and used only once (one-time pad), the cipher is theoretically unbreakable.

### 2.2 RC4 Algorithm Overview

RC4 operates in two distinct phases:

#### Phase 1: Key-Scheduling Algorithm (KSA)
The KSA initializes and scrambles the S-Box (substitution box), a permutation of integers 0-255, based on the secret key.

#### Phase 2: Pseudo-Random Generation Algorithm (PRGA)
The PRGA generates the keystream by performing controlled swaps and index calculations on the S-Box.

---

## 3. Algorithm Specification

### 3.1 Initialization

The S-Box **S** is initialized as the identity permutation:
```
S[i] = i, for i ∈ [0, 255]
```

### 3.2 Key-Scheduling Algorithm (KSA)

The KSA takes a variable-length key **key[]** and generates an initial permutation **S[256]**:

```
j = 0
for i = 0 to 255:
    j = (j + S[i] + key[i mod len(key)]) mod 256
    swap(S[i], S[j])
```

**Time Complexity:** O(256) = O(1) constant
**Space Complexity:** O(256) = O(1) constant

**Algorithm Properties:**
- The KSA guarantees that every permutation of the S-Box is equally likely for uniformly random keys of length ≥ 256 bytes
- Key length typically ranges from 5 to 256 bytes (40 to 2048 bits)
- The algorithm is sensitive to key length; longer keys provide stronger initial scrambling

### 3.3 Pseudo-Random Generation Algorithm (PRGA)

The PRGA generates keystream bytes **K[t]** for XOR operations with plaintext:

```
i = 0, j = 0
for each plaintext byte at position x:
    i = (i + 1) mod 256
    j = (j + S[i]) mod 256
    swap(S[i], S[j])
    t = (S[i] + S[j]) mod 256
    K[x] = S[t]
    ciphertext[x] = plaintext[x] ⊕ K[x]
```

**Time Complexity:** O(n) where n is the message length
**Space Complexity:** O(1) additional space

**Algorithm Properties:**
- The PRGA generates one keystream byte per iteration
- The keystream period is theoretically 2^2048 bits for random keys
- Each iteration involves exactly three modular arithmetic operations and two array accesses

---

## 4. Implementation Details

### 4.1 Technical Architecture

The project consists of three core components:

#### 4.1.1 HTML Interface (`index.html`)
- Responsive container layout with header, controls, and dashboard panels
- Input fields for secret key and data (plaintext or ciphertext)
- Speed control slider (1-500 ms delay) for visualization pacing
- Encryption and decryption buttons
- S-Box visualization grid (16×16 layout for 256 cells)
- Execution log panel with step-by-step operation details
- Final result display area

#### 4.1.2 JavaScript Implementation (`script.js`)
- S-Box initialization and management
- KSA and PRGA algorithm implementations
- Conversion utilities:
  - `stringToBytes()`: ASCII to byte conversion
  - `bytesToString()`: Byte to ASCII conversion
  - `bytesToHex()`: Byte to hexadecimal conversion
  - `hexToBytes()`: Hexadecimal to byte conversion
- Asynchronous execution with AbortController for real-time visualization
- Step-by-step logging of algorithm state

#### 4.1.3 CSS Styling (`style.css`)
- Strict color palette: black background, white text, yellow accents
- Grid-based visualization with responsive cell sizing
- Dynamic cell highlighting:
  - White: Index i (current position in KSA/PRGA)
  - Yellow: Index j (swap target position)
  - Yellow border: Index t (keystream byte source)
- Terminal-style monospace font (Courier New)

### 4.2 Core Functions

#### `stringToBytes(str)`
Converts a string to an array of byte values using JavaScript's `charCodeAt()` method.
```javascript
const stringToBytes = (str) => Array.from(str).map(c => c.charCodeAt(0));
```

#### `runInteractiveRC4(action)`
Main execution function handling both encryption and decryption:
1. Input validation (key and data presence)
2. Data parsing (text for encryption, hex for decryption)
3. S-Box initialization
4. KSA phase execution
5. PRGA phase execution
6. Result formatting and display

**Parameters:**
- `action`: "encrypt" or "decrypt"

**Error Handling:**
- Missing key or input validation
- Invalid hexadecimal input detection
- Abort signal for user cancellation

#### `updateGrid(S, i, j, k)`
Updates the visualization grid to reflect current S-Box state and active indices:
- Clears previous highlighting
- Applies appropriate CSS classes for index positions
- Re-renders all 256 cell values

#### `appendLog(text)`
Logs algorithm steps with automatic scrolling to most recent entry.

### 4.3 Data Flow Diagram

```
User Input (Key, Data, Speed)
    ↓
Input Validation & Parsing
    ↓
S-Box Initialization: S[i] = i (i ∈ [0, 255])
    ↓
KSA Phase:
    for i = 0 to 255:
        j = (j + S[i] + key[i % len(key)]) mod 256
        swap(S[i], S[j])
        update visualization
    ↓
PRGA Phase (for each plaintext byte):
    i = (i + 1) mod 256
    j = (j + S[i]) mod 256
    swap(S[i], S[j])
    t = (S[i] + S[j]) mod 256
    K = S[t]
    ciphertext_byte = plaintext_byte ⊕ K
    update visualization & log
    ↓
Output Result (Hex for encryption, ASCII for decryption)
```

---

## 5. Usage Guide

### 5.1 Opening the Application

1. Clone or download the repository
2. Open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge)
3. No server or additional dependencies required

### 5.2 Interface Components

#### Input Section
- **Secret Key:** Enter the encryption key (any ASCII characters, e.g., "YELLOW")
- **Input Data:** 
  - For encryption: plain ASCII text (e.g., "HELLO")
  - For decryption: hexadecimal string (e.g., "84E86D01D0")
- **Delay (Speed Control):** Range slider (1-500 ms) to control visualization speed

#### Output Section
- **S-Box Visualization:** 16×16 grid showing current state of permutation
  - White cell: Position i (current KSA/PRGA index)
  - Yellow cell: Position j (swap target)
  - Yellow bordered cell: Position t (keystream source)
- **Execution Log:** Detailed step-by-step operations with intermediate values
- **Final Result:** Encrypted or decrypted output

### 5.3 Encryption Workflow

1. Enter a secret key: `YELLOW`
2. Enter plaintext: `HELLO`
3. Set desired speed (recommended: 50-100 ms for analysis)
4. Click **ENCRYPT** button
5. Observe:
   - KSA phase: 256 iterations of S-Box scrambling
   - PRGA phase: One iteration per plaintext byte
   - Final output: Hexadecimal ciphertext

### 5.4 Decryption Workflow

1. Enter the same secret key used for encryption: `YELLOW`
2. Enter ciphertext in hexadecimal: (output from encryption)
3. Set desired speed
4. Click **DECRYPT** button
5. Observe algorithm replay with ciphertext bytes
6. Final output: Original plaintext

### 5.5 Example Execution

**Encryption Example:**
```
Key: YELLOW
Plaintext: HELLO
Expected Ciphertext: 84E86D01D0 (or similar, depends on iteration)
```

**Decryption Example:**
```
Key: YELLOW
Ciphertext: 84E86D01D0
Expected Plaintext: HELLO
```

---

## 6. Cryptographic Properties and Weaknesses

### 6.1 Strengths

- **Simplicity:** Minimal code footprint, easy to implement correctly
- **Speed:** Exceptionally fast for software-based encryption
- **Efficiency:** Low memory requirements (256 bytes for S-Box)
- **Versatility:** Works with variable-length keys (1-256 bytes)

### 6.2 Known Weaknesses and Attacks

#### 6.2.1 Initial Key-Stream Bias
- First bytes of keystream show statistical bias from the key
- **Mitigation:** Discard first 256 bytes (or more) of keystream

#### 6.2.2 Weak Key Schedules (Related-Key Attacks)
- Certain key patterns produce predictable S-Box configurations
- **Mitigation:** Pre-hash keys; use cryptographic key derivation

#### 6.2.3 Fluhrer, Mantin, Shamir (FMS) Attack
- Exploits weak KSA properties in WEP (802.11)
- Recovers WEP keys in minutes with adequate ciphertexts
- **Impact:** Led to WEP deprecation in WiFi

#### 6.2.4 Biases in Keystream Output
- Long-term statistical biases discovered through analysis
- Affects security when processing large amounts of data

#### 6.2.5 Time-Memory Trade-off Attacks
- General stream cipher vulnerability
- Requires massive pre-computed tables

### 6.3 Recommendations

- **Legacy Systems:** RC4 remains acceptable for non-critical applications
- **New Development:** Use ChaCha20, AES-GCM, or other modern ciphers
- **WPA/WPA2:** Moved to AES-based algorithms (CCMP)
- **Research:** RC4 serves pedagogical and historical value in cryptanalysis

---

## 7. Performance Characteristics

### 7.1 Computational Complexity

| Phase | Time Complexity | Space Complexity | Operations |
|-------|-----------------|------------------|------------|
| KSA   | O(1)            | O(1)             | 256 iterations, 2 accesses per iteration |
| PRGA  | O(n)            | O(1)             | n iterations, 3 mod operations per iteration |
| **Total** | **O(n)** | **O(1)** | **n dependent** |

### 7.2 Benchmarks (Approximate)

- **KSA Phase:** ~256 iterations, typically <1ms on modern hardware
- **PRGA Phase:** ~1000 bytes/ms on modern hardware (highly hardware-dependent)
- **Visualization Overhead:** 50-500ms per execution (user-controlled via speed slider)

---

## 8. Mathematical Notation

### 8.1 Symbols and Definitions

| Symbol | Definition |
|--------|-----------|
| **S[]** | Substitution box (permutation array of size 256) |
| **i** | Current position pointer in PRGA |
| **j** | Swap target position pointer |
| **t** | Index used to select keystream byte from S-Box |
| **K[x]** | Keystream byte at position x |
| **P[x]** | Plaintext byte at position x |
| **C[x]** | Ciphertext byte at position x |
| **⊕** | XOR (bitwise exclusive OR) operation |
| **mod** | Modular arithmetic (remainder after division) |

### 8.2 Formal Algorithm Definition

**KSA(key[], S[])**
```
Input: Secret key array key[] of length len(key)
       Initialized S-Box: S[i] = i for i ∈ [0, 255]
Output: Scrambled S-Box S[]

j ← 0
for i ← 0 to 255:
    j ← (j + S[i] + key[i mod len(key)]) mod 256
    swap(S[i], S[j])
end for
```

**PRGA(data[], S[])**
```
Input: Plaintext (or ciphertext) data[] of length n
       S-Box S[] from KSA
Output: Keystream K[] (for XOR with data)

i ← 0, j ← 0
for x ← 0 to n-1:
    i ← (i + 1) mod 256
    j ← (j + S[i]) mod 256
    swap(S[i], S[j])
    t ← (S[i] + S[j]) mod 256
    K[x] ← S[t]
    output[x] ← data[x] ⊕ K[x]
end for
```

---

## 9. File Structure

```
RC4-Algorithm/
├── README.md              (This file - comprehensive documentation)
├── index.html             (Web interface - HTML structure)
├── script.js              (Core algorithm implementation - JavaScript)
├── style.css              (Visual styling and themes - CSS)
└── .git/                  (Git version control)
```

### File Descriptions

- **README.md:** Complete documentation including algorithm theory, implementation details, usage guide, and security analysis
- **index.html:** Main web interface with input controls, visualization panels, and output display
- **script.js:** JavaScript implementation of RC4 KSA/PRGA algorithms with visualization integration
- **style.css:** Styling for terminal-like interface with black background, white text, and yellow accents

---

## 10. Technical Requirements and Compatibility

### 10.1 Browser Requirements

- **Modern JavaScript (ES6+):** Arrow functions, const/let declarations, async/await
- **DOM API:** getElementById, classList, addEventListener
- **CSS Grid:** For S-Box visualization layout
- **Flexbox:** For responsive container layouts

**Supported Browsers:**
- Chrome/Chromium (version 55+)
- Firefox (version 54+)
- Safari (version 10+)
- Edge (version 15+)
- Opera (version 42+)

### 10.2 No External Dependencies

This project is self-contained with no external libraries or frameworks:
- No jQuery, React, Vue, or other frameworks
- No third-party cryptographic libraries
- Pure HTML5, CSS3, and Vanilla JavaScript
- Suitable for offline use

### 10.3 System Requirements

- **RAM:** <10 MB (minimal memory footprint)
- **Storage:** <50 KB
- **Internet:** Not required after initial load
- **Processing:** Negligible CPU for visualization

---

## 11. Research Applications

### 11.1 Educational Use Cases

1. **Cryptography Courses:** Visual learning of stream cipher fundamentals
2. **Algorithm Analysis:** Step-by-step execution for understanding control flow
3. **Complexity Analysis:** Observing time/space tradeoffs during execution
4. **Key Scheduling:** Understanding permutation generation and state transitions

### 11.2 Cryptanalysis Research

1. **Keystream Bias Analysis:** Monitoring output distribution across iterations
2. **S-Box Evolution:** Tracking how secret key affects permutation quality
3. **Attack Simulation:** Testing FMS and other known attacks
4. **Weak Key Detection:** Identifying keys that produce predictable patterns

### 11.3 Security Auditing

1. **Legacy System Analysis:** Validating RC4 implementations in production systems
2. **Key Derivation:** Testing various key generation methods and their effects
3. **Protocol Analysis:** Understanding RC4 usage in SSL/TLS or WEP/WPA
4. **Vulnerability Assessment:** Practical demonstration of RC4 weaknesses

---

## 12. Limitations and Future Enhancements

### 12.1 Current Limitations

1. **Browser-only:** Cannot be deployed as server-side cipher for production
2. **Visualization overhead:** Speed slider delays affect performance analysis
3. **Limited to single instances:** No multi-threaded or GPU acceleration
4. **Text encoding:** Assumes ASCII/UTF-8 for simplicity; binary not supported
5. **No persistence:** Results not saved between sessions

### 12.2 Potential Enhancements

1. **Additional Algorithms:** Implement ChaCha20, AES, or other ciphers for comparison
2. **Statistical Analysis:** Histogram of keystream distribution, entropy calculation
3. **Attack Demonstrations:** FMS attack simulation, weak key identification
4. **Key Derivation Functions:** PBKDF2, Argon2 integration
5. **Export/Import:** Save session results, compare multiple runs
6. **Hexadecimal Editor:** Better visualization for binary data
7. **Performance Metrics:** Real-time graphs of execution speed
8. **Mobile Support:** Responsive design for tablets and phones

---

## 13. References and Further Reading

### Academic Papers

1. Rivest, R. L. (1987). "The RC4 Encryption Algorithm." RSA Laboratories.
2. Fluhrer, S., Mantin, I., & Shamir, A. (2001). "Weaknesses in the Key Scheduling Algorithm of RC4." Selected Areas in Cryptography (SAC).
3. Mantin, I., & Shamir, A. (2001). "A Practical Attack on Broadcast RC4." Fast Software Encryption (FSE).
4. Maximov, A., & Kucuk, O. (2008). "The Stream Cipher RC4 and Its Variants." Cryptology ePrint Archive.

### Standards and Specifications

- RFC 6234: US Secure Hash and HMAC Algorithms
- NIST SP 800-38A: Recommendation for Block Cipher Modes of Operation
- IEEE 802.11i: Security Standards for Wireless Networking

### Online Resources

- https://en.wikipedia.org/wiki/RC4
- https://tools.ietf.org/html/rfc6054 (Using RSA Algorithms with CMSSNMP)
- https://github.com/crypto-js/crypto-js (Reference implementations in JavaScript)

---

## 14. Disclaimer

This implementation is provided for **educational and research purposes only**. While functionally correct, this code should **not be used** for protecting sensitive information in production systems due to:

1. **Known cryptographic weaknesses** in the RC4 algorithm itself
2. **Lack of hardware acceleration** for critical operations
3. **No formal security audits** or certifications
4. **Browser execution environment** which may be compromised

For production cryptography, use established libraries (OpenSSL, NaCl, libsodium) with modern algorithms (ChaCha20-Poly1305, AES-GCM).

---

## 15. Citation

If you use this project for research or educational purposes, please cite it as:

```bibtex
@software{rc4-visualization-2024,
  title={RC4 Algorithm: Interactive Visualization and Analysis},
  author={Muhammad Asif},
  year={2024},
  url={https://github.com/muhammad-asif10/RC4-Algorithm}
}
```

---

## 16. License and Attribution

This project is provided as an open-source educational resource. Please refer to the LICENSE file in the repository for specific terms of use.

---

## 17. Contact and Contributions

For questions, bug reports, or contributions, please:

1. Open an issue on GitHub
2. Submit a pull request with improvements
3. Contact the repository maintainer

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Status:** Complete Research Documentation
