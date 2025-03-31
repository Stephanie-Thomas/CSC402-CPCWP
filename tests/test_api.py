import requests

BASE_URL = "http://localhost:4000/api"

def test_codeforces_leaderboard():
    """Test the Codeforces leaderboard endpoint"""
    response = requests.get(f"{BASE_URL}/codeforces-leaderboard")
    
    # Basic response validation
    assert response.status_code == 200, "Should return 200 OK"
    
    # Validate response structure
    data = response.json()
    assert isinstance(data, list), "Response should be a list"
    assert len(data) > 0, "Should return at least one user"
    
    # Validate individual entries
    for user in data:
        assert "handle" in user, "User should have handle"
        assert isinstance(user.get("rating"), (int, type(None))), "Rating should be number or null"
        assert "rank" in user, "User should have rank"

def test_leetcode_leaderboard():
    """Test the LeetCode leaderboard endpoint"""
    response = requests.get(f"{BASE_URL}/leetcode-leaderboard")
    
    # Basic response validation
    assert response.status_code == 200, "Should return 200 OK"
    
    # Validate response structure
    data = response.json()
    assert isinstance(data, list), "Response should be a list"
    assert len(data) > 0, "Should return at least one user"
    
    # Validate individual entries
    for user in data:
        assert "username" in user, "User should have username"
        assert isinstance(user["totalSolved"], int), "totalSolved should be integer"
        assert "contestRanking" in user, "Should have contest ranking info"
        assert "contestTitle" in user, "Should have contest title info"