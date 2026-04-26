SELECT 
    User.Name,
    Skill.Skill_name,
    User_skill.Proficiency_level
FROM User
JOIN User_skill ON User.User_id = User_skill.User_id
JOIN Skill ON Skill.Skill_id = User_skill.Skill_id;

SELECT 
    o.Title,
    ROUND(
        COUNT(us.Skill_id) * 100.0 /
        (SELECT COUNT(*) 
         FROM Requirement r2 
         WHERE r2.Opportunity_id = o.Opportunity_id),
        2
    ) AS Match_Percentage
FROM Opportunity o
JOIN Requirement r ON o.Opportunity_id = r.Opportunity_id
JOIN User_skill us ON r.Skill_id = us.Skill_id
WHERE us.User_id = 1
GROUP BY o.Opportunity_id;

SELECT 
    Opportunity.Title,
    COUNT(Application.Application_id) AS Total_Applications
FROM Opportunity
LEFT JOIN Application 
ON Opportunity.Opportunity_id = Application.Opportunity_id
GROUP BY Opportunity.Opportunity_id;

SELECT 
    Skill.Skill_name,
    COUNT(*) AS Demand_Count
FROM Requirement
JOIN Skill ON Requirement.Skill_id = Skill.Skill_id
GROUP BY Skill.Skill_name
ORDER BY Demand_Count DESC;

SELECT 
    User.Name,
    Opportunity.Title,
    Application.Status
FROM Application
JOIN User ON Application.User_id = User.User_id
JOIN Opportunity ON Application.Opportunity_id = Opportunity.Opportunity_id
WHERE Application.Status = 'Accepted';