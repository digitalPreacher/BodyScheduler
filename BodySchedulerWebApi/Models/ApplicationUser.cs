﻿using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace BodySchedulerWebApi.Models
{
    public class ApplicationUser : IdentityUser<int>
    {
        [Key]
        public override int Id { get; set; }
        public bool IsSubscribed { get; set; }
        public bool AcceptedAgreement { get; set; }
        public DateTime CreateAt { get; set; } = DateTime.Now;
    }
}
