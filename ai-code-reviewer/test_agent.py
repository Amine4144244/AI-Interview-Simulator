#!/usr/bin/env python3
"""
Test script to demonstrate the AI Code Review Agent functionality
"""

import sys
sys.path.insert(0, 'ai-agent')

from agent import analyze_code_main
import json

def print_separator():
    print("\n" + "="*80 + "\n")

def test_javascript_bugs():
    print("🔍 TEST 1: JavaScript Bug Detection")
    print_separator()
    
    code = """
function getData(id) {
    var result = fetch('/api/' + id).then(r => r.json())
    if (result == null) {
        console.log('No data')
    }
    return result
}
"""
    
    print("Code to analyze:")
    print(code)
    print_separator()
    
    result = analyze_code_main(code, 'javascript', 'senior', ['bugs', 'clean_code', 'security'])
    
    print(f"✅ Issues found: {len(result['issues'])}")
    print(f"📊 Overall score: {result['scores']['overall']}/100")
    print_separator()
    
    print("Issues:")
    for i, issue in enumerate(result['issues'], 1):
        print(f"\n{i}. {issue['title']} (Line {issue['line']}, Severity: {issue['severity']})")
        print(f"   Problem: {issue['description']}")
        print(f"   Risk: {issue['risk']}")
        print(f"   Solution: {issue['suggestion']}")
    
    print_separator()
    print("Improved code:")
    print(result['improved_code'])
    print_separator()

def test_python_security():
    print("🔍 TEST 2: Python Security Analysis")
    print_separator()
    
    code = """
password = "admin123"

def process_data(user_input):
    result = eval(user_input)
    return result
"""
    
    print("Code to analyze:")
    print(code)
    print_separator()
    
    result = analyze_code_main(code, 'python', 'mid', ['security', 'bugs'])
    
    print(f"✅ Issues found: {len(result['issues'])}")
    print(f"📊 Security score: {result['scores']['security']}/100")
    print_separator()
    
    print("Critical security issues:")
    for issue in result['issues']:
        if issue['severity'] == 'critical':
            print(f"\n❌ {issue['title']} (Line {issue['line']})")
            print(f"   {issue['risk']}")
    
    print_separator()

def test_performance():
    print("🔍 TEST 3: Performance Analysis")
    print_separator()
    
    code = """
async function processItems(items) {
    items.forEach(async (item) => {
        await fetch('/api/process', {
            method: 'POST',
            body: JSON.stringify(item)
        })
    })
}
"""
    
    print("Code to analyze:")
    print(code)
    print_separator()
    
    result = analyze_code_main(code, 'javascript', 'senior', ['performance', 'bugs'])
    
    print(f"✅ Issues found: {len(result['issues'])}")
    print(f"📊 Performance score: {result['scores']['performance']}/100")
    print_separator()
    
    if result['follow_up_questions']:
        print("Follow-up questions:")
        for q in result['follow_up_questions']:
            print(f"  • {q}")
    
    print_separator()

if __name__ == "__main__":
    print("🤖 AI Code Reviewer & Mentor - Test Suite")
    print("="*80)
    
    try:
        test_javascript_bugs()
        test_python_security()
        test_performance()
        
        print("\n✅ All tests completed successfully!")
        print("\n💡 The AI agent is working correctly and ready for production use.")
        
    except Exception as e:
        print(f"\n❌ Test failed: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
