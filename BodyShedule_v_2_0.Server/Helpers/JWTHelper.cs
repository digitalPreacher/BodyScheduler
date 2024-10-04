﻿using BodyShedule_v_2_0.Server.DataTransferObjects;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BodyShedule_v_2_0.Server.Helpers
{
    public static class JWTHelper
    { 
        public static string GenerateToken(UserLoginDTO userCredentials, string role)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Environment.GetEnvironmentVariable("JWTAUTH_SECRETKEY") ?? 
                throw new InvalidOperationException("SecretKey not found")));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userCredentials.Login),
                new Claim("role", role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: Environment.GetEnvironmentVariable("JWTAUTH_ISSUER"),
                audience: Environment.GetEnvironmentVariable("JWTAUTH_AUDIENCE"),
                claims: claims,
                expires: DateTime.Now.AddMinutes(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

