using System.Reflection;
using AutoCab.Db;
using AutoCab.Server.BuildInjections;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbSetup(builder.Configuration);

var app = builder.Build();

app.Run();