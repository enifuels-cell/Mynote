<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\RedirectIfAuthenticated as Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated extends Middleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, \Closure $next, ...$guards): Response
    {
        return $next($request);
    }
}
